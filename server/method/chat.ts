import {
  CacheUser,
  Participant,
  TempRoom,
  CacheRoomList,
  ChatCommunicationData,
  User,
} from '../type/type';
import myDate from './myDate';
import { chatNamespace } from '../routers/socket';
import participantValidation from '../API/validation/participant';
import messageValidation from '../API/validation/message';
let { findUsers, tempRooms, roomList, attendUsers } = require('../data/cache');
const db: any = require('../models/index');

const chatMethod = (socket: any): void => {
  console.log(socket.adapter.rooms);

  //채팅방 나가기
  socket.on('disconnect', async (data: any): Promise<any> => {
    try {
      let user: any = attendUsers.get(socket.id);
      if (user) {
        console.log(user);
        let myRoom = roomList.get(user.room_id);
        let findUser = myRoom.users.find(
          (item: any) => user.email === item.email,
        );
        if (findUser) myRoom.users.splice(myRoom.users.indexOf(findUser), 1);
        if (myRoom.users.length > 0) {
          roomList.set(user.room_id, myRoom);
          socket.leave(user.room_id);
          chatNamespace.to(user.room_id).emit('leave_room', {
            message: `${findUser.nick_name}(${findUser.email}) 님이 채팅방을 나갔습니다..`,
            users: myRoom.users,
          });
        } else roomList.delete(user.room_id);
        attendUsers.delete(socket.id);
        console.log(myRoom);
        console.log(roomList);
      }
    } catch (e) {
      console.log(e);
    }
    console.log(socket.id + 'disconnect');
  });

  /*
      enter room
      data = {
        room_id,
        email
      }
    */
  socket.on('join_room', async (data: ChatCommunicationData): Promise<void> => {
    try {
      console.log('joinroom');
      // 미리 접속되어있던 클라이언트를 나가게 변경
      for (const [key, value] of attendUsers) {
        console.log(value);
        console.log(attendUsers.get(key));
        if (value.email === data.email) {
          console.log('access');
          await chatNamespace.to(key).emit('reject', {
            message: 'another client access',
          });
        }
        attendUsers.delete(key);
      }
      let user = await db.User.findOne({
        attributes: ['email', 'nick_name', 'profile_image', 'role'],
        where: { email: data.email },
      });
      user = user.dataValues;
      user.enterDate = myDate.dateToString(new Date(), '-', true);
      socket.join(data.room_id);
      attendUsers.set(socket.id, { email: data.email, room_id: data.room_id });
      //현재 접속중인 유저 저장
      let myRoom = roomList.get(data.room_id);

      if (!myRoom) {
        roomList.set(data.room_id, {
          users: [user],
        });
        myRoom = roomList.get(data.room_id);
      } else if (
        myRoom &&
        !myRoom.users.find(
          (item: User | any): boolean => item.email === data.email,
        )
      ) {
        myRoom.users = [...myRoom.users, user];
        roomList.set(data.room_id, myRoom);
        socket.broadcast.to(data.room_id).emit('alarm_enter', {
          message: `${user.nick_name}(${user.email}) 님이 입장하였습니다.`,
          users: myRoom.users,
          user,
        });
      }
    } catch (e) {
      console.log('join catch');
      console.log(e);
      chatNamespace
        .to(socket.id)
        .emit('reject', { message: 'join_room: invalid access', code: e });
    }
  });
  /*
      message insert
      data = {
        email,
        room_id,
        content
        type : only img
      }
    */
  socket.on('msg_insert', async (data: ChatCommunicationData | any) => {
    try {
      let user = await db.User.findOne({ where: { email: data.email } });
      user = user.dataValues;
      let message = await messageValidation.insertMessage(
        data.room_id,
        data.content,
        user.email,
        data.type || 'TEXT',
      );
      chatNamespace.to(data.room_id).emit('msg_insert', {
        message: `${data.content}`,
        sender: user,
        message_id: message.id,
      });
    } catch (e) {
      console.log(e);
      chatNamespace
        .to(socket.id)
        .emit('reject', { message: 'msg: invalid access', code: e });
    }
  });
  /*
      message update
      data = {
        room_id,
        email,
        content,
        message_id
      }
      
    */
  socket.on('msg_update', async (data: ChatCommunicationData | any) => {
    try {
      let user = await db.User.findOne({ where: { email: data.email } });
      let message = await messageValidation.updateMessage(
        data.message_id,
        data.content,
      );
      chatNamespace.to(data.room_id).emit('msg_update', {
        message: `${data.content}`,
        sender: user,
        message_id: data.message_id,
        writeDate: message.write_date,
      });
    } catch (e) {
      console.log(e);
      chatNamespace
        .to(socket.id)
        .emit('reject', { message: 'msg: invalid access', code: e });
    }
  });

  /*
      chat room leave
      data = {
        email,
        room_id
      }
    */
  // 사용안함 - disconnect 로 통합
  socket.on('leave_room', async (data: ChatCommunicationData) => {
    try {
      let user = await db.User.findOne({ where: { email: data.email } });
      user = user.dataValues;

      //현재 룸 캐시에서 삭제
      let myRoom = roomList.get(data.room_id);
      let findUser = myRoom.users.find(
        (item: any) => data.email === item.email,
      );
      if (findUser) {
        myRoom.users.splice(myRoom.users.indexOf(findUser), 1);
      }
      roomList.set(data.room_id, myRoom);
      socket.leave(data.room_id);
      chatNamespace.to(data.room_id).emit('leave_room', {
        message: `${user.nick_name}(${user.email}) 님이 채팅방을 나갔습니다..`,
        users: myRoom.users,
      });
    } catch (e) {
      console.log(e);
      chatNamespace
        .to(socket.id)
        .emit('reject', { message: 'leave_room: invalid access', code: e });
    }
  });

  /*
      meeting leave
      data = {
        email,
        room_id
      }
    */
  socket.on('leave_meeting', async (data: ChatCommunicationData) => {
    //현재 룸 캐시에서 삭제
    try {
      let myRoom = roomList.get(data.room_id);
      let findUser = myRoom.users.find(
        (item: any) => data.email === item.email,
      );

      let user = await db.User.findOne({ where: { email: data.email } });
      user = user.dataValues;
      //db에서 삭제
      let deleteMe: any = await participantValidation.leaveRoom(
        data.email,
        data.room_id,
      );
      attendUsers.delete(socket.id);
      socket.leave(data.room_id);
      if (findUser) myRoom.users.splice(myRoom.users.indexOf(findUser), 1);

      if (myRoom.users.length > 0) {
        roomList.set(data.room_id, myRoom);
        chatNamespace.to(data.room_id).emit('leave_meeting', {
          email: data.email,
          users: myRoom.users,
          message: `${user.nick_name}(${user.email}) 님이 모임을 나갔습니다..`,
        });
      } else roomList.delete(data.room_id);

      chatNamespace.to(socket.id).emit('out', '');
    } catch (e) {
      console.log(e);
    }
  });
};

export default chatMethod;
