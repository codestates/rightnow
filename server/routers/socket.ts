import express, { Request, Response, Router, NextFunction } from 'express';
import participantValidation from '../API/validation/participant';
import roomValidation from '../API/validation/room';
import myDate from '../method/myDate';
const db: any = require('../models/index');
const socketRouter: Router = express.Router();
const http: any = require('http').createServer(socketRouter);
const socketPort = 4000;
const UUID_FUNC: Function = require('../method/uuid');
const SEARCH_COUNT = 5;
http.listen(socketPort, () => {
  console.log('listening on *:' + socketPort);
});

const io: any = require('socket.io')(http, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

interface Participant {
  email: string;
  lon: number;
  lat: number;
}
interface TempRoom {
  uuid: string;
  category_id: string;
  allow_num: number;
  location: string;
  participants: Array<any>;
}
//roomList db작업 필요
let roomList: Array<string> = [];
//let findUsers: Map<string, string | Array<string>> = new Map();

//현재 찾기 진행중인 유저들
let findUsers: Map<string, any> = new Map();

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
const searchNamespace = io.of('/search');

const chatNamespace = io.of('/chat');

searchNamespace.on('connection', (socket: any) => {
  //모임 매치를 클릭했을 경우
  /*
   데이터 형식
      data = {
        category_id :number,
        location :string,
        email: string,
        type: string, // 'ALONE' or 'GROUP'
        email_list: Array<string> // only group
        lon: float,
        lat: float
      }
   */
  socket.on('enter', async (data: any): Promise<void> => {
    //로직 종료 시
    socket.leave(data.email);
  });
  socket.on('find_room', async (data: any): Promise<void> => {
    //강제 종료했다가 들어오지 않은 경우만
    if (!findUsers.get(data.email)) {
      await socket.join(data.email);
    } else {
      //강제 종료 후 들어온 경우
      await searchNamespace.to(data.email).emit('reject_match', {
        message: 'anther client request',
      });
      socket.join(data.email);
    }
    console.log(socket.adapter.rooms);
    // 이미 어떠한 방에 들어가 있는 경우
    let canEnter: boolean = await participantValidation.checkParticipant(
      data.email,
      data.type,
      data.type === 'ALONE' ? [] : data.email_list,
    );
    if (!canEnter) {
      searchNamespace.to(data.email).emit('reject_match', {
        message: 'aleady attended room',
      });
      return;
    }
    if (data.type === 'GROUP') {
      // todo 그룹 중 모임을 searching 중인 사람이 있는 경우 - ! 완료 ! 테스트 필요
      for (let user of data.email_list) {
        let findGroup = findUsers.get(user);
        if (findGroup) {
          await searchNamespace.to(data.email).emit('reject_match', {
            message: 'some group member aleady searching',
          });
        }
      }
    }
    // 이미 모임 searching 중인 경우
    //상태 wait -> watiing 으로 emit search -> search_room으로 emit
    let find = findUsers.get(data.email);
    if (find) {
      if (find.status === 'wait')
        searchNamespace.to(data.email).emit('wait', find);

      if (find.status === 'search') {
        searchNamespace.to(data.email).emit('search_room', find);
      }
      return;
    }

    //위 조건이 모두 일치하면 searching 으로 넘어감 - 10초마다 searching
    data.count = 0;
    findUsers.set(data.email, {
      ...data,
      status: 'search',
    });
    if (data.type === 'GROUP') {
      for (let email of data.email_list) {
        findUsers.set(data.email, {
          ...data,
          status: 'search',
        });
      }
    }
    searchNamespace.to(data.email).emit('search_room', data);
  });
  // 방 찾는 로직
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
        is_temp_room: bool
      }
    */

  socket.on('search_room', async (data: any): Promise<void> => {
    let id: string = '';
    try {
      if (!findUsers.get(data.email)) return;
      console.log(data.email + 'searching');
      id = await roomValidation.searchRoom(data);
      console.log(id);
    } catch (e) {
      if (data) {
        searchNamespace.to(data.email).emit('reject_match', {
          message: 'room search: invalid access',
          code: e,
        });
        return;
      } else console.log(e);
    }
    // database 에서 방찾기가 성공했을 경우
    if (id !== 'fail') {
      if (data.count > SEARCH_COUNT) return;
      clearTimeout(searchings.get(data.email));
      searchings.delete(data.email);
      findUsers.delete(data.email);
      if (data.type === 'GROUP') {
        for (let email of data.email_list) findUsers.delete(email);
      }

      let roomData = null;
      try {
        roomData = await participantValidation.enterRoom(
          data.email,
          id,
          data.type,
          data.lon,
          data.lat,
          data.type === 'GROUP' ? data.emil_list : [],
        );
      } catch (e) {
        //잘못된 계정은 invalid 리턴
        searchNamespace.to(data.email).emit('reject_match', {
          message: 'enter room: invalid access',
          code: e,
        });
        console.log(e);
        return;
      }
      if (roomData !== 'user aleady attend this room') {
        data.roomData = roomData;
        searchNamespace.to(data.email).emit('enter', data);
        socket.leave(data.email);
        return;
      }
    }

    //임시 룸 검색 ...
    let findRoom: any = tempRooms.find((item) => {
      return item.category_id === data.category_id &&
        item.location === data.location &&
        data.type === 'ALONE'
        ? item.allow_num > item.participants.length
        : item.allow_num > item.participants.length + data.email_list.length;
    });

    // 조건에 맞는 임시 룸이 있을 경우 임시 룸에 참가
    if (findRoom) {
      if (data.count > SEARCH_COUNT) return;
      clearTimeout(searchings.get(data.email));
      searchings.delete(data.email);
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
      });
      // todo Group일 경우 그룹에도 추가 - 완료 ! 테스트 필요
      if (data.type === 'GROUP') {
        for (let user of data.email_list) {
          findUsers.set(user, {
            ...findUsers.get(user),
            uuid: findRoom.uuid,
          });
        }
      }
      //
      // 만약 참가한 임시 룸의 방이 다 차면 임시룸 제거 후 db insert
      if (findRoom.allow_num === findRoom.participants.length) {
        console.log(findRoom.participants);
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
          searchNamespace.to(data.email).emit('reject_match', {
            message: 'room create: invalid access',
            code: e,
          });
          return;
        }
        let index = tempRooms.indexOf(findRoom);
        tempRooms.splice(index, 1);
        data.room_id = room.id;

        searchNamespace.to(data.email).emit('waiting', data);
        return;
      }
    }
    // 원하는 룸을 찾을 수 없을 경우 count 가 10 이상일 경우 해당 카테고리의 임시 룸 생성 아닐경우 방찾기 지속
    else {
      // 찾기 count가 10회 미만일 경우 - 계속 찾기

      if (data.count < SEARCH_COUNT) {
        clearTimeout(searchings.get(data.email));
        let interval = setTimeout((): void => {
          searchNamespace.to(data.email).emit('search_room', data);
        }, 5000);
        searchings.set(data.email, interval);
        //myDate.sleep(5000);
        //searchNamespace.to(data.email).emit('search_room', data);
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
        clearTimeout(searchings.get(data.email));
        searchings.delete(data.email);
        let category: any = await db.Category.findOne({
          where: { id: data.category_id },
        });
        console.log('category');
        let participants: Array<string> | any =
          data.type === 'ALONE'
            ? [{ email: data.email, lon: data.lon, lat: data.lat }]
            : [
                { email: data.email, lon: data.lon, lat: data.lat },
                ...data.email_list.map((user_email: string) => {
                  return { user_email, lon: data.lon, lat: data.lat };
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
        data.room = tempRooms;

        //findUser에 uuid추가
        findUsers.set(data.email, {
          ...findUsers.get(data.email),
          uuid: uuid,
        });
        // todo GROUP일 경우 GROUP들에도 추가 - 완료 ! 테스트 필요
        if (data.type === 'GROUP') {
          for (let user of data.email_list) {
            findUsers.set(user, {
              ...findUsers.get(user),
              uuid: uuid,
            });
          }
        }
        //
      }
    }

    findUsers.set(data.email, { ...data, status: 'wait' });
    if (data.type === 'GROUP') {
      for (let email of data.email_list)
        findUsers.set(email, { ...data, status: 'wait' });
    }
    searchNamespace.to(data.email).emit('waiting', data);
    return;
  });

  // 임시 룸에 들어와서 기다리고 있음
  socket.on('waiting', async (data: any): Promise<void> => {
    try {
      console.log(socket.adapter.rooms);
      // console.log(
      //   tempRooms.find((item) => item.uuid === findUsers.get(data.email).uuid)
      //     .participants,
      // );
      console.log(data.email + 'waiting');
      let me = findUsers.get(data.email);
      if (!me) {
        clearTimeout(searchings.get(data.email));
        searchings.delete(data.email);
        // findUsers 에서 제거 - 이미 제거됨
        searchNamespace.to(data.email).emit('enter', data);
        return;
      }
      let tempRoom = tempRooms.find((item) => (item.uuid = data.uuid));
      data.room = tempRoom;

      // myDate.sleep(5000);
      // searchNamespace.to(data.email).emit('waiting', data);
      clearTimeout(searchings.get(data.email));
      let interval = setTimeout((): void => {
        searchNamespace.to(data.email).emit('waiting', data);
      }, 5000);
      searchings.set(data.email, interval);
    } catch (e) {
      if (data) {
        searchNamespace
          .to(data.email)
          .emit('reject_match', { message: 'wait: invalid access' });
        return;
      } else console.log('wait:invalid access');
    }
  });

  //client 에서 cancel 버튼 클릭 시
  socket.on('cancel', async (data: any): Promise<void> => {
    try {
      console.log(data.email + 'cancel');
      if (searchings.get(data.email)) {
        clearTimeout(searchings.get(data.email));
        searchings.delete(data.email);
      }
      // is_reset = true 인 경우는 강제종료 후 들어왔을 경우
      if (!data.is_reset) {
        // 대기중인 방에서 삭제
        if (findUsers.get(data.email).uuid) {
          let myRoom = tempRooms.find(
            (item: any): boolean =>
              item.uuid === findUsers.get(data.email).uuid,
          );
          let idx = myRoom.participants.indexOf(
            myRoom.participants.find(
              (user: any): boolean => user.email === data.email,
            ),
          );
          console.log('idx: ' + idx);
          // todo 만약 유저가 더이상 없다면 - 해당 임시룸 삭제 수정완료 ! 테스트 필요
          myRoom.participants.splice(idx, 1);
          if (myRoom.participants.length === 0)
            tempRooms.splice(tempRooms.indexOf(myRoom), 1);
        }
        findUsers.delete(data.email);
        //todo 그룹일 경우 - 유저들 전부 삭제 - 완료 ! 테스트 필요
        if (data.type === 'GROUP') {
          for (let email of data.email_list) findUsers.delete(email);
        }
      }

      searchNamespace.to(data.email).emit('cancel', data);
      console.log(data.email + ' leave');
      socket.leave(data.email);
    } catch (e) {
      console.log('cancel: invalid access');
    }
  });
});

// ... todo chatting room
chatNamespace.on('connection', (socket: any) => {
  socket.on('join_room', async (data: any): Promise<void> => {
    if (
      roomList.filter((item: string): boolean =>
        data.room_id === item ? true : false,
      ).length === 0
    ) {
      roomList = [...roomList, data.room_id];
    }
    await socket.join(data.room_id);

    //db작업 필요
    let sendData = data;
    socket.broadcast.to(data.room_id).emit('joinRoom', {
      message: `${data.email} 님이 입장하셨습니다.`,
      sendData,
    });
  });

  socket.on('msg', (data: any) => {
    //db작업 필요
    let sendData = data;
    socket.broadcast.to(data.room_id).emit('msg', data);
  });
});

export default socketRouter;
