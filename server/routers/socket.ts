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
import searchMethod from '../method/search';
import chatMethod from '../method/chat';
// const db: any = require('../models/index');
const socketRouter: Router = express.Router();
const cors: any = require('cors');

const httpServer: any = require('http');
const http: Http2Server | any = httpServer.createServer();
const socketPort: number = 4000;

const io = new Server(http, {
  cors: {
    origin: 'https://right-now.link',
    credentials: true,
    methods: ['PATCH', 'POST', 'DELETE', 'GET', 'PUT', 'OPTIONS'],
  },
});

http.listen(socketPort, () => {
  console.log('listening on *:' + socketPort);
});
//client 에서  주소/search 로 보내줘야 함
const searchNamespace: Namespace = io.of('/search');

const chatNamespace: Namespace = io.of('/chat');
try {
  searchNamespace.on('connection', searchMethod);

  chatNamespace.on('connection', chatMethod);
} catch (e) {
  console.log(e);
}
export default socketRouter;
export { chatNamespace, searchNamespace };
