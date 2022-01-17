import {
  CacheUser,
  Participant,
  TempRoom,
  CacheRoomList,
  ChatCommunicationData,
  User,
} from '../type/type';
import myDate from './myDate';
import { searchNamespace } from '../routers/socket';
import participantValidation from '../API/validation/participant';
import messageValidation from '../API/validation/message';
import roomValidation from '../API/validation/room';
let { findUsers, tempRooms, roomList, attendUsers } = require('../data/cache');
const db: any = require('../models/index');
const SEARCH_COUNT: number = 5;
const UUID_FUNC: Function = require('./uuid');

const searchMethod = (socket: any) => {
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
        let findRoom: any = tempRooms.find(
          (item: any) => item.uuid === find.uuid,
        );
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
    let findRoom: any = tempRooms.find((item: any) => {
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
};

export default searchMethod;
