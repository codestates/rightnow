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
} from './routers/index';

const cookieParser: any = require('cookie-parser');
const app: Express = express();
const port: number = 80;

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use('/admin', adminRouter);
app.use('/category', categoryRouter);
app.use('/message', messageRouter);
app.use('/participant', participantRouter);
app.use('/room', roomRouter);
app.use('/user', userRouter);
app.use(socketRouter);
app.get('/', (req: Request, res: Response): void => {
  res.send('Hellow TypeScript!! !!! x');
});

app.listen(port, () => {
  console.log('localhost ' + port + ' opened!!');
});
