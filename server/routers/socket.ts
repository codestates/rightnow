import express, { Request, Response, Router, NextFunction } from 'express';

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

//roomList db작업 필요
let roomList: Array<string> = [];

// server socket 통신 임시 구현
io.on('connection', (socket: any) => {
  console.log(socket.id);
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
