import express, { Request, Response, Router, NextFunction } from 'express';
import participantValidation from '../API/validation/participant';
import roomValidation from '../API/validation/room';
const db: any = require('../models/index');
const socketRouter: Router = express.Router();
const http: any = require('http').createServer(socketRouter);
const socketPort = 4000;
const UUID_FUNC: Function = require('../method/uuid');
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

let userTimeout: Map<string, NodeJS.Timer | any> = new Map();
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
  socket.on('disconnect', async (data: any): Promise<void> => {
    //강제 종료 시
    await socket.leave(data.email);
  });
  socket.on('find_room', async (data: any): Promise<void> => {
    console.log(data);
    await socket.join(data.email);

    // 이미 어떠한 방에 들어가 있는 경우
    let canEnter: boolean = await participantValidation.checkParticipant(
      data.email,
      data.type,
      data.type === 'ALONE' ? [] : data.email_list
    );
    if (!canEnter) {
      searchNamespace.to(data.email).emit('reject_match', {
        message: 'aleady attended room',
      });
      return;
    }

    // 이미 모임 searching 중인 경우
    // if (findUsers.filter((item) => item === data.email).length > 0) {
    //   searchNamespace.to(socket.id).emit('reject_match', {
    //     message: 'aleady searching',
    //   });
    //   return;
    // }
    let find = findUsers.get(data.email);
    if (find) {
      if (find.status === 'wait')
        searchNamespace.to(data.email).emit('wait', find);

      if (find.status) searchNamespace.to(data.email).emit('search_room', find);
    }
    // 그룹 중 모임을 searching 중인 사람이 있는 경우

    // todo - 찾는 도중 웹을 닫고 or 강제종료 후 나갔을 경우 생성

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
    console.log(data.email + 'searching');
    // todo cancel 시 로직 생성해야 함
    let id: string = await roomValidation.searchRoom(data);

    // database 에서 방찾기가 성공했을 경우
    if (id !== 'fail') {
      findUsers.delete(data.email);
      if (data.type === 'GROUP') {
        for (let email of data.email_list) findUsers.delete(email);
      }

      let roomData = await participantValidation.enterRoom(
        data.email,
        id,
        data.type,
        data.lon,
        data.lat,
        data.type === 'GROUP' ? data.emil_list : []
      );
      searchNamespace.to(data.email).emit('enter', data);
      socket.leave(data.email);
      return;
    }

    //임시 룸 검색 ...
    console.log(tempRooms);
    let findRoom: any = tempRooms.find((item) => {
      return item.category_id === data.category_id &&
        item.location === data.location &&
        data.type === 'ALONE'
        ? item.allow_num > item.participants.length
        : item.allow_num > item.participants.length + data.email_list.length;
    });

    // 조건에 맞는 임시 룸이 있을 경우 임시 룸에 참가
    if (findRoom) {
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
      clearInterval(searchings.get(data.email));
      data.uuid = findRoom.uuid;
      data.room = findRoom;
      // 만약 참가한 임시 룸의 방이 다 차면 임시룸 제거 후 db insert
      if (findRoom.allow_num === findRoom.participants) {
        let participants = [...findRoom.participants];
        //본인의 이메일 리스트에서 제거
        participants.splice(
          participants.indexOf(
            participants.find((item: any) => item === data.email)
          ),
          1
        );
        //룸 추가
        let room = await roomValidation.createRoom({
          location: data.location,
          category_id: data.category_id,
        });
        //temproom 에 있는 모든 인원 룸에 입장
        await participantValidation.enterRoom(
          data.email,
          room.id,
          'GROUP',
          data.lon,
          data.lat,
          participants
        );
        let index = tempRooms.indexOf(findRoom);
        tempRooms.splice(index, 1);
        data.room_id = room.id;

        for (let email of findRoom.participants) {
          findUsers.delete(email);
          await searchNamespace.to(data.email).emit('enter', data);
          await socket.leave(data.email);
        }
        return;
      }
    }
    // 원하는 룸을 찾을 수 없을 경우 count 가 10 이상일 경우 해당 카테고리의 임시 룸 생성 아닐경우 방찾기 지속
    else {
      // 찾기 count가 10회 미만일 경우 - 계속 찾기
      if (data.count < 10) {
        setTimeout((): void => {
          tempRooms;
          searchNamespace.to(data.email).emit('search_room', data);
        }, 5000);
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
      }
    }

    // waiting 으로 emit interval 시킴
    // let waitingInterval: NodeJS.Timer | any = setInterval(
    //   searchNamespace.to(data.email).emit('waiting', data)
    // );
    // searchings.set(data.email, waitingInterval);

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
    console.log(tempRooms.find((item) => item.uuid === data.uuid).participants);
    console.log(data.email + 'waiting');
    // ... todo
    //let me = findUsers.find((item) => item === data.email);
    let me = findUsers.get(data.email);
    if (!me) {
      // findUsers 에서 제거 - 이미 제거됨
      searchNamespace.to(data.email).emit('enter', data);
      socket.leave(data.email);
      return;
    }
    let tempRoom = tempRooms.find((item) => (item.uuid = data.uuid));
    data.room = tempRoom;
    setTimeout((): void => {
      searchNamespace.to(data.email).emit('waiting', data);
    }, 5000);
  });

  //client 에서 cancel 버튼 클릭 시
  socket.on('cancel', async (data: any): Promise<void> => {
    console.log(data.email + 'cancel');
    findUsers.delete(data.email);
    if (data.type === 'GROUP') {
      for (let email of data.email_list) findUsers.delete(email);
    }
    searchNamespace.to(data.email).emit('cancel', data);
    console.log(data.email + 'leave');
    socket.leave(data.email);
  });
});

// ... todo chatting room
chatNamespace.on('connection', (socket: any) => {
  socket.on('join_room', async (data: any): Promise<void> => {
    if (
      roomList.filter((item: string): boolean =>
        data.room_id === item ? true : false
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
