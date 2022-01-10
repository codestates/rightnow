import express, { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  sendData?: any;
  file?: any;
}
interface CacheUser {
  category_id: number;
  location: string;
  email: string;
  type: string;
  email_list?: Array<string>;
  lon: number;
  lat: number;
  status?: string;
  uuid?: string;
  is_master?: boolean;
}
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
interface User {
  email: string;
  nick_name: string;
  profile_img: string;
  enterDate: string;
  role: string;
}
interface CacheRoomList {
  users: Array<User>;
}
interface ChatCommunicationData {
  room_id: string;
  email: string;
  content?: string;
  message_id?: number;
}

export {
  CustomRequest,
  CacheUser,
  Participant,
  TempRoom,
  CacheRoomList,
  ChatCommunicationData,
  User,
};
