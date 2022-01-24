import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import {
  adminRouter,
  categoryRouter,
  messageRouter,
  participantRouter,
  roomRouter,
  userRouter,
  socketRouter,
  friendRouter,
  oauthRouter,
} from './routers/index';

const cookieParser: Function = require('cookie-parser');
const app: Express = express();
const port: number = 80;

app.use(
  cors({
    credentials: true,
    origin: 'https://right-now.link',
    methods: ['PATCH', 'POST', 'DELETE', 'GET', 'PUT', 'OPTIONS'],
  }),
);
app.use('/image/user', express.static('./image/user'));
app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use('/admin', adminRouter);
app.use('/category', categoryRouter);
app.use('/message', messageRouter);
app.use('/participant', participantRouter);
app.use('/room', roomRouter);
app.use('/user', userRouter);
app.use('/friend', friendRouter);
app.use('/oauth', oauthRouter);

//app.use(socketRouter);
app.get('/', (req: Request, res: Response): void => {
  res.send('It is RightNow Server !');
});

app.listen(port, () => {
  console.log('localhost ' + port + ' opened!!');
});
