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
// socketRouter.use(function (req, res, next) {
//   res.header(
//     'Access-Control-Allow-Origin',
//     'https://codebaker-rightnow.netlify.app',
//   );
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept',
//   );
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });
socketRouter.use(
  cors({
    origin: 'https://codebaker-rightnow.netlify.app',
    credentials: true,
    methods: ['PATCH', 'POST', 'DELETE', 'GET', 'PUT', 'OPTIONS'],
  }),
);
const httpServer: any = require('http');
const http: Http2Server | any = httpServer.createServer(socketRouter);
const socketPort: number = 4000;
// const UUID_FUNC: Function = require('../method/uuid');
// const SEARCH_COUNT: number = 5;
// let { findUsers, tempRooms, roomList, attendUsers } = require('../data/cache');

// http.listen(socketPort, () => {
//   console.log('listening on *:' + socketPort);
// });

// const io: Server | any = require('socket.io')(http, {
//   cors: {
//     origin: 'https://codebaker-rightnow.netlify.app',
//     methods: ['PATCH', 'POST', 'DELETE', 'GET', 'PUT', 'OPTIONS'],
//     credentials: true,
//   },
// });
const io = new Server(http);
// , {
//   cors: {
//     origin: 'https://codebaker-rightnow.netlify.app',
//     credentials: true,
//   },
// }
http.listen(socketPort, () => {
  console.log('listening on *:' + socketPort);
});
//client 에서  주소/search 로 보내줘야 함
const searchNamespace: Namespace = io.of('/search');

const chatNamespace: Namespace = io.of('/chat');

searchNamespace.on('connection', searchMethod);

chatNamespace.on('connection', chatMethod);

export default socketRouter;
export { chatNamespace, searchNamespace };
