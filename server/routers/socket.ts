import express, { Request, Response, Router, NextFunction } from 'express';
import participantValidation from '../API/validation/participant';
import roomValidation from '../API/validation/room';
const socketRouter: Router = express.Router();
const http: any = require('http').createServer(socketRouter);
const socketPort = 4000;

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
  user_email: string;
  lon: number;
  lat: number;
}

//roomList db작업 필요
let roomList: Array<string> = [];
//let findUsers: Map<string, string | Array<string>> = new Map();

//현재 찾기 진행중인 유저들
let findUsers: Array<string> = [];

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
let tempRooms: Array<any> = [];

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
  socket.on('find_room', async (data: any): Promise<void> => {
    await socket.join(data.email);

    // 이미 어떠한 방에 들어가 있는 경우
    let canEnter: boolean = await participantValidation.checkParticipant(
      data.email,
      data.type,
      data.type === 'ALONE' ? [] : data.email_list
    );
    if (!canEnter) {
      searchNamespace.to(socket.id).emit('reject_match', {
        message: 'aleady attended room',
      });
      return;
    }

    // 이미 모임 searching 중인 경우
    if (findUsers.filter((item) => item === data.email).length > 0) {
      searchNamespace.to(socket.id).emit('reject_match', {
        message: 'aleady searching',
      });
      return;
    }
    // 그룹 중 모임을 searching 중인 사람이 있는 경우
    if (data.type === 'GROUP') {
      for (let email of data.email_list) {
        if (findUsers.filter((item) => item === email).length > 0) {
          searchNamespace.to(socket.id).emit('reject_match', {
            message: 'aleady searching',
          });
          return;
        }
      }
    }

    //위 조건이 모두 일치하면 searching 으로 넘어감 - 10초마다 searching
    let interval: NodeJS.Timer | any = setInterval(
      searchNamespace.to(data.email).emit('search_room', data),
      10000
    );
    findUsers =
      data.type === 'GROUP'
        ? [...findUsers, ...data.email_list, data.email]
        : [...findUsers, data.email];
    searchings.set(data.email, interval);
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
    let id: string = await roomValidation.searchRoom(data);

    // database 에서 방찾기가 성공했을 경우
    if (id !== 'fail') {
      clearInterval(searchings.get(data.email));
      findUsers.splice(findUsers.indexOf(data.email), 1);

      if (data.type === 'GROUP') {
        for (let email of data.email_list)
          findUsers.splice(findUsers.indexOf(email), 1);
      }

      let roomData = await participantValidation.enterRoom(
        data.email,
        id,
        data.type,
        data.lon,
        data.lat,
        data.type === 'GROUP' ? data.emil_list : []
      );
      //io.to(data.email).emit('join_room', roomData);
      socket.leave(data.email);
      return;
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
      let me: Participant = {
        user_email: data.email,
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
                return { user_email, lon: me.lon, lat: me.lat };
              }),
            ];
      let index = tempRooms.indexOf(findRoom);
      clearInterval(searchings.get(data.email));
      data.roomIndex = index;

      // 만약 참가한 임시 룸의 방이 다 차면 임시룸 제거 후 db insert
      if (findRoom.allow_num === findRoom.participants) {
        let room = await roomValidation.createRoom({
          location: data.location,
          category_id: data.category_id,
        });
        tempRooms.splice(index, 1);
      }
    }
    // 원하는 룸을 찾을 수 없을 경우 해당 카테고리의 임시 룸 생성
    else {
      // ... todo
    }

    // waiting 으로 emit interval 시킴
    let waitingInterval: NodeJS.Timer | any = setInterval(
      searchNamespace.to(data.email).emit('waiting', data)
    );
    searchings.set(data.email, waitingInterval);
    return;
  });

  // 임시 룸에 들어와서 기다리고 있음
  socket.on('waiting', async (data: any): Promise<void> => {
    // ... todo
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
