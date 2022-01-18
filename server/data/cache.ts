import {
  CacheUser,
  Participant,
  TempRoom,
  CacheRoomList,
  ChatCommunicationData,
  User,
} from '../type/type';
//현재 찾기 진행중인 유저들
let findUsers: Map<string, CacheUser | any> = new Map();
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
let roomList: Map<string, CacheRoomList | any> = new Map();
let attendUsers: Map<string, any> = new Map();

module.exports = { findUsers, tempRooms, roomList, attendUsers };
