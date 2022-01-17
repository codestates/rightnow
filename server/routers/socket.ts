import express, { Request, Response, Router, NextFunction } from 'express';
import participantValidation from '../API/validation/participant';
import roomValidation from '../API/validation/room';
import messageValidation from '../API/validation/message';
import {
  CacheUser,
  Participant,
  TempRoom,
  CacheRoomList,
  ChatCommunicationData,
  User,
} from '../type/type';
import myDate from '../method/myDate';
import { Socket, Server, Namespace } from 'socket.io';
import { Http2Server } from 'http2';

const db: any = require('../models/index');
const socketRouter: Router = express.Router();
const http: Http2Server = require('http').createServer(socketRouter);
const socketPort: number = 4000;
const UUID_FUNC: Function = require('../method/uuid');
const SEARCH_COUNT: number = 5;

http.listen(socketPort, () => {
  console.log('listening on *:' + socketPort);
});

const io: Server | any = require('socket.io')(http, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

//현재 찾기 진행중인 유저들
let findUsers: Map<string, CacheUser | any> = new Map();

//유저들의 로직
let searchings: Map<string, NodeJS.Timer | any> = new Map();

//생성 대기중인 임시 룸
/*
 엘리면트 형식
 {
    category_id:number,
    allow_num
    location:string,
    participants:Array<Participant>
 }
*/
let tempRooms: Array<TempRoom | any> = [];

//client 에서  주소/search 로 보내줘야 함
const searchNamespace: Namespace = io.of('/search');

const chatNamespace: Namespace = io.of('/chat');

searchNamespace.on('connection', (socket: any) => {
  socket.on('disconnect', (data: any) => {
    try {
      console.log(socket.id + ' disconnect');
    } catch {}
  });
  console.log(socket.id + ' conntect');

  /*
    매칭 페이지 입장 시 현재 searching 상태 체크 
    data ={
      email
    }
  */
  socket.on('searching_check', async (data: any): Promise<void> => {
    let canEnter: any = true;
    if (socket.adapter.rooms.get(data.email)) {
      await searchNamespace.to(data.email).emit('reject_match', {
        message: 'another client request',
      });
    }
    try {
      canEnter = await participantValidation.checkParticipant(
        data.email,
        'ALONE',
        [],
      );
    } catch (e) {
      console.log('searching ck catch');
      console.log(e);
      searchNamespace.to(socket.id).emit('reject_match', {
        message: 'invalid access',
      });
    }

    if (canEnter.message === 'exist') {
      //클라이언트에서 해당 룸으로 리다이렉션 시킴
      searchNamespace.to(socket.id).emit('reject_match', {
        message: 'aleady attended room',
        room_id: canEnter.room_id,
      });
      return;
    }
    let find = findUsers.get(data.email);
    socket.join(data.email);
    if (find) {
      if (find.status === 'wait') {
        let findRoom: any = tempRooms.find((item) => item.uuid === find.uuid);
        socket.join(find.uuid);
        await searchNamespace.to(socket.id).emit('searching_check', {
          message: 'waiting',
          maxNum: findRoom.allow_num,
        });
        searchNamespace.to(find.uuid).emit('waiting', findRoom);
      }
      if (find.status === 'search') {
        let category = await db.Category.findOne({
          where: { id: find.category_id },
        });
        await searchNamespace.to(socket.id).emit('searching_check', {
          message: 'search',
          maxNum: category.dataValues.user_num,
        });
        if (find.is_master) {
          find.count = 0;
          searchNamespace.to(data.email).emit('search_room', find);
        }
      }
      return;
    } else {
      searchNamespace.to(socket.id).emit('searching_check', { message: 'ok' });
    }
  });
  /*
   searching 가능한 상태의 친구만 filter
    data = {
      email_list: array<string>
    }
  */
  socket.on('searching_friend', async (data: any): Promise<void> => {
    let findList: Array<string> = [];
    let leaveList: Array<any> = [...data.email_list];
    //현재 matching 진행중인 친구 확인
    await data.email_list.forEach((item: any) => {
      let findIdx = leaveList.indexOf(
        leaveList.find((user: any) => user.email === item.email),
      );
      if (findUsers.get(item.email)) {
        findList.push(item.email);
        leaveList.splice(findIdx, 1);
      }
    });
    //이미 룸에 들어가 있는 친구 확인
    if (leaveList.length > 0) {
      try {
        let canEnter = await participantValidation.checkParticipant(
          'none',
          'GROUP',
          leaveList.map((item: any) => item.email),
        );
        if (canEnter.message !== 'no exist') {
          await canEnter.list.forEach((item: any) => {
            let findIdx = leaveList.indexOf(
              leaveList.find((user: any) => user.email === item),
            );
            leaveList.splice(findIdx, 1);
          });
        }
      } catch (e) {
        console.log('searching frends');
        console.log(e);
        searchNamespace
          .to(socket.id)
          .emit('reject_match', { message: 'invalid access' });
      }
    }
    searchNamespace.to(socket.id).emit('searching_friend', {
      leave_friends: leaveList,
    });
  });

  /*
    방에 입장이 완료되 matching 종료될 경우
    data = {
      uuid:string,
      email:string
    }
  */
  socket.on('enter', async (data: any): Promise<void> => {
    //로직 종료 시
    if (data.is_insert) {
      socket.leave(data.uuid);
    }
    socket.leave(data.email);
  });

  //모임 매치를 클릭했을 경우
  /*
   데이터 형식
      data = {
        category_id :number,
        location :string, - 서버에서 생성
        email: string,
        type: string, // 'ALONE' or 'GROUP'
        email_list: Array<string> // only group
        lon: float,
        lat: float
      }
   */
  socket.on('find_room', async (data: CacheUser | any): Promise<void> => {
    //강제 종료했다가 들어오지 않은 경우만
    let findUser = findUsers.get(data.email);

    // 이미 어떠한 방에 들어가 있는 경우
    let canEnter: any = true;
    try {
      //매칭이 가능한지 체크
      canEnter = await participantValidation.checkParticipant(
        data.email,
        data.type,
        data.type === 'ALONE' ? [] : data.email_list,
      );
    } catch (e) {
      console.log('searching find - ck part');
      console.log(e);
      searchNamespace.to(socket.id).emit('reject_match', {
        message: 'invalid access',
      });
    }
    if (canEnter.message === 'exist' || canEnter.message === 'someone exist') {
      //클라이언트에서 해당 룸으로 리다이렉션 시킴
      if (
        data.type === 'ALONE' ||
        (data.type === 'GROUP' && canEnter.message === 'exist')
      ) {
        searchNamespace.to(data.email).emit('reject_match', {
          message: 'aleady attended room',
          room_id: canEnter.room_id,
        });
      } else {
        searchNamespace.to(data.email).emit('reject_match', {
          message: 'someone aleady attended room',
        });
      }
      return;
    }
    if (data.type === 'GROUP') {
      // todo 그룹 중 모임을 searching 중인 사람이 있는 경우 - 매칭 취소 ! 완료 ! 테스트 필요
      for (let user of data.email_list) {
        let findGroup = findUsers.get(user);
        if (findGroup) {
          searchNamespace.to(data.email).emit('reject_match', {
            message: 'some group member aleady searching',
          });
          return;
        }
      }
      try {
        let category: any = await db.Category.findOne({
          where: { id: data.category_id },
        });
        // searching 중인 카테고리의 허용 숫자가 그룹 인원보다 적거나 같을경우
        if (category.dataValues.user_num <= data.email_list.length + 1) {
          searchNamespace.to(data.email).emit('reject_match', {
            message: 'out of range user number',
          });
          return;
        }
      } catch (e) {
        console.log('searching find inval');
        await searchNamespace.to(data.email).emit('reject_match', {
          message: 'invalid access',
        });
        return;
      }
    }
    //위 조건이 모두 일치하면 searching 으로 넘어감 - 5초마다 searching
    data.count = 0;

    findUsers.set(data.email, {
      ...data,
      status: 'search',
      is_master: true,
    });

    //그룹일 경우 그룹 모든 인원 findUsers에 추가
    if (data.type === 'GROUP') {
      for (let email of data.email_list) {
        findUsers.set(email, {
          ...data,
          status: 'search',
        });
      }
    }
    searchNamespace.to(data.email).emit('search_room', data);
  });

  // room searching 로직
  /*
      데이터 형식
      data = {
        category_id :number,
        location :string,
        email: string,
        type: string, // 'ALONE' or 'GROUP'
        email_list: Array<string> // only group
        lon: float,
        lat: float,
        count: number
      }
    */

  socket.on('search_room', async (data: any): Promise<void> => {
    let id: string = '';
    try {
      console.log(data.email + 'searching');
      id = await roomValidation.searchRoom(data);
    } catch (e) {
      console.log('searching room ck 2');
      console.log(e);
      searchNamespace.to(data.email).emit('reject_match', {
        message: 'invalid access',
        code: e,
      });
      return;
    }
    // database 에서 방찾기가 성공했을 경우
    if (id !== 'fail') {
      console.log('database room find' + socket);

      let room_id = null;
      try {
        if (data.count > SEARCH_COUNT) return;
        if (searchings.get(data.email)) {
          clearTimeout(searchings.get(data.email));
          searchings.delete(data.email);
        }
        findUsers.delete(data.email);
        //group일 경우 모든 그룹원들 delete
        if (data.type === 'GROUP') {
          for (let email of data.email_list) findUsers.delete(email);
        }
        room_id = await participantValidation.enterRoom(
          data.email,
          id,
          data.type,
          data.lon,
          data.lat,
          data.type === 'GROUP' ? data.email_list : [],
        );
      } catch (e) {
        console.log('searching enter');
        //잘못된 계정은 invalid 리턴
        searchNamespace.to(data.email).emit('reject_match', {
          message: 'invalid access',
          code: e,
        });
        console.log(e);
        return;
      }
      // db에 있는 방에 들어가면 해당 방으로 리다이렉션
      data.room_id = room_id;
      searchNamespace.to(data.email).emit('enter', data);
      socket.leave(data.email);
      return;
    }
    //임시 룸 검색 ...
    let findRoom: any = tempRooms.find((item) => {
      let allowEnter: boolean =
        data.type === 'ALONE'
          ? item.allow_num > item.participants.length
          : item.allow_num > item.participants.length + data.email_list.length;
      return (
        item.category_id === data.category_id &&
        item.location === data.location &&
        allowEnter
      );
    });
    // 조건에 맞는 임시 룸이 있을 경우 임시 룸에 참가
    if (findRoom) {
      console.log('temp room find');

      if (data.count > SEARCH_COUNT) return;
      let me: Participant = {
        email: data.email,
        lon: data.lon,
        lat: data.lat,
      };

      findRoom.participants =
        data.type === 'ALONE'
          ? [...findRoom.participants, me]
          : [
              ...findRoom.participants,
              me,
              ...data.email_list.map((user_email: string) => {
                return { email: user_email, lon: me.lon, lat: me.lat };
              }),
            ];
      data.uuid = findRoom.uuid;
      data.room = findRoom;
      //findUser 에 uuid 추가
      findUsers.set(data.email, {
        ...findUsers.get(data.email),
        uuid: findRoom.uuid,
        status: 'wait',
      });
      // Group일 경우 그룹에도 추가 - 완료 ! 테스트 완료
      if (data.type === 'GROUP') {
        for (let user of data.email_list) {
          findUsers.set(user, {
            ...findUsers.get(user),
            uuid: findRoom.uuid,
            status: 'wait',
          });
        }
      }

      // 만약 참가한 임시 룸의 방이 다 차면 임시룸 제거 후 db insert
      if (findRoom.allow_num === findRoom.participants.length) {
        console.log('temp room to database');
        for (let user of findRoom.participants) {
          findUsers.delete(user.email);
        }
        let participants = [...findRoom.participants];
        //본인의 이메일 리스트에서 제거
        participants.splice(
          participants.indexOf(
            participants.find((item: any) => item === data.email),
          ),
          1,
        );
        //룸 추가
        let room = null;
        try {
          // todo 한로직에 처리할지 현재처럼 나눠서 insert할지 ...
          room = await roomValidation.createRoom({
            location: data.location,
            category_id: data.category_id,
          });
          //temproom 에 있는 모든 인원 룸에 입장
          await participantValidation.enterRoom(
            data.email,
            room.id,
            'TEMP',
            data.lon,
            data.lat,
            participants,
          );
        } catch (e) {
          console.log('searching temp to db');
          console.log(e);
          searchNamespace.to(socket.id).emit('reject_match', {
            message: 'invalid access',
            code: e,
          });
          return;
        }
        //임시 룸 제거
        let index = tempRooms.indexOf(findRoom);
        tempRooms.splice(index, 1);

        data.room_id = room.id;
        findRoom.room_id = room.id;
        let send = { ...findRoom };
        send.is_insert = true;

        //clearTimeout(searchings.get(data.email));
        //searchings.delete(data.email);
        socket.join(data.uuid);
        searchNamespace.to(data.uuid).emit('waiting', send);
        return;
      }
    }
    // 원하는 룸을 찾을 수 없을 경우 count 가 10 이상일 경우 해당 카테고리의 임시 룸 생성 아닐경우 방찾기 지속
    else {
      // 찾기 count가 10회 미만일 경우 - 계속 찾기
      if (data.count < SEARCH_COUNT) {
        searchNamespace.to(data.email).emit('search_room', data);
        return;
      } else {
        // 찾기 count가 10회 이상일 경우 - 룸 생성
        /*
        엘리면트 형식
        {
            uuid:uuid
            category_id:number,
            allow_num
            location:string,
            participants:Array<Participant>
        }
        */
        let category: any = await db.Category.findOne({
          where: { id: data.category_id },
        });

        let participants: Array<string> | any =
          data.type === 'ALONE'
            ? [{ email: data.email, lon: data.lon, lat: data.lat }]
            : [
                { email: data.email, lon: data.lon, lat: data.lat },
                ...data.email_list.map((user_email: string) => {
                  return { email: user_email, lon: data.lon, lat: data.lat };
                }),
              ];
        //room 생성 후 rooms 에 추가
        let uuid: string = UUID_FUNC();
        let tempRoom = {
          uuid,
          category_id: data.category_id,
          allow_num: category.dataValues.user_num,
          location: data.location,
          participants,
        };
        tempRooms = [...tempRooms, tempRoom];
        data.uuid = uuid;
        data.room = tempRoom;

        //findUser에 uuid추가
        findUsers.set(data.email, {
          ...findUsers.get(data.email),
          uuid: uuid,
          status: 'wait',
        });
        // GROUP일 경우 GROUP들에도 추가 - 완료 ! 테스트 완료
        if (data.type === 'GROUP') {
          for (let user of data.email_list) {
            findUsers.set(user, {
              ...findUsers.get(user),
              uuid: uuid,
              status: 'wait',
            });
          }
        }
      }
    }

    socket.join(data.uuid);
    searchNamespace.to(data.uuid).emit('waiting', data.room);
    if (data.type === 'GROUP') {
      for (let email of data.email_list)
        searchNamespace.to(email).emit('waiting_group', data.room);
    }
    return;
  });

  //그룹원들 waiting 으로 이동
  socket.on('waiting_group', (data: any) => {
    console.log('waiting group');
    socket.join(data.uuid);
    searchNamespace.to(data.uuid).emit('waiting', data);
  });

  //client 에서 cancel 버튼 클릭 시
  /*
    data = {
      email,
      type,
      email_list // only group
    }
  */
  socket.on('cancel', async (data: any): Promise<void> => {
    try {
      console.log(data.email + ' cancel');
      let findUser = findUsers.get(data.email);
      if (!findUser) {
        searchNamespace
          .to(socket.id)
          .emit('reject_match', { message: 'invalid access' });
        return;
      }
      if (findUser.type === 'GROUP' && !findUser.is_master) {
        console.log('reject cancel ' + data.email);
        searchNamespace
          .to(socket.id)
          .emit('reject_match', { message: 'not group master' });
        return;
      }
      // 대기중인 방에서 삭제
      if (findUser.uuid) {
        let myRoom = tempRooms.find(
          (item: any): boolean => item.uuid === findUser.uuid,
        );
        let idx = myRoom.participants.indexOf(
          myRoom.participants.find(
            (user: any): boolean => user.email === data.email,
          ),
        );

        //해당 유저를 룸에서 제거
        myRoom.participants.splice(idx, 1);
        //그룹인 경우 그룹원들도 룸에서 삭제
        if (findUser.type === 'GROUP') {
          for (let email of data.email_list) {
            let subIdx = myRoom.participants.indexOf(
              myRoom.participants.find(
                (user: any): boolean => user.email === email,
              ),
            );
            myRoom.participants.splice(subIdx, 1);
          }
        }
        socket.leave(findUser.uuid);
        // 만약 유저가 더이상 없다면 - 해당 임시룸 삭제 수정완료 ! 테스트 완료
        if (myRoom.participants.length === 0)
          tempRooms.splice(tempRooms.indexOf(myRoom), 1);
        else searchNamespace.to(findUser.uuid).emit('waiting', myRoom);
      }
      //그룹일 경우 - find list 에서 그룹원 전부 삭제 - 완료 ! 테스트 완료
      if (findUser.type === 'GROUP') {
        for (let email of data.email_list) {
          findUsers.delete(email);
          let uuid = findUser.uuid ? findUser.uuid : '';
          searchNamespace.to(email).emit('cancel', { is_master: false, uuid });
        }
      }
      findUsers.delete(data.email);

      searchNamespace.to(data.email).emit('cancel', { is_master: true });
      socket.leave(data.email);
    } catch (e) {
      console.log(e);
      console.log('invalid access - cancel');
    }
  });
});

let roomList: Map<string, CacheRoomList | any> = new Map();
let attendUsers: Map<string, any> = new Map();
// chatting room - 작업 완료 ! 테스트 완료
chatNamespace.on('connection', (socket: any) => {
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
});

export default socketRouter;
