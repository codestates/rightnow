import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { categoryAPI } from '../api/categoryApi';
import { roomAPI } from '../api/roomApi';
import Chatting from '../components/Chatting';
import Header from '../components/layout/Header';
import MemberList from '../components/MemberList';
import { userEmail, userIsLogin } from '../reducers/userSlice';
import { useAppDispatch, useAppSelector } from '../config/hooks';
import { MessageType, CategoryType, UserType } from '../type';
import { setParticipant } from '../reducers/roomSlice';
import LoginConfirm from '../components/LoginConfirm';
import { showAlert } from '../reducers/componetSlice';

function dateToString(date: Date, format: string = '', needTime: boolean = false): string {
  let dd: any = date.getDate();
  let mm: any = date.getMonth() + 1; //January is 0!

  let yyyy: any = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  yyyy = yyyy.toString();
  mm = mm.toString();
  dd = dd.toString();

  let m: any = date.getHours();
  let s: any = date.getMinutes();

  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }
  m = m.toString();
  s = s.toString();

  let s1 = yyyy + format + mm + format + dd;
  let s2 = yyyy + format + mm + format + dd + ' ' + m + ':' + s;
  return needTime ? s2 : s1;
}

const MemberContainer = styled.div`
  background-color: white;
  padding: 1rem 1.3rem;
  border-radius: 0.5rem;
  width: 30%;
  height: 100%;
`;

const ChatBox = styled.div`
  width: 70%;
  margin-right: 1rem;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-top: 6rem;
  background: ${(props) => props.theme.color.main};
  color: ${(props) => props.theme.color.font};
  overflow: hidden;

  @media only screen and (max-width: 768px) {
    & {
      padding-top: 4rem;
    }
  }
`;

const ChatContainer = styled.div`
  width: 60%;
  background: ${(props) => props.theme.color.sub.white};
  height: 95%;
  padding: 2rem;
  box-shadow: 10px 10px 0 0 rgb(0, 0, 0, 0.4);
  @media screen and (max-width: 1200px) {
    & {
      width: 80%;
    }
  }
  @media screen and (max-width: 992px) {
    & {
      width: 90%;
    }
  }
  @media screen and (max-width: 768px) {
    & {
      width: 100%;
      height: 100%;
    }
    ${MemberContainer} {
      display: none;
    }
    ${ChatBox} {
      width: 100%;
    }
  }
`;

const RoomDetail = styled.div`
  margin-bottom: 1.5rem;
`;

const ContentContainer = styled.div`
  display: flex;
  height: 90%;
`;

const GroupTitle = styled.div`
  font-size: 1.5rem;
  background: ${(props) => props.theme.color.sub.title};
  color: black;
  padding: 0.5rem 0.8rem;
  margin-bottom: 0.3rem;
  box-shadow: 6px 6px 0 0 rgb(255, 99, 53, 0.4);
  width: 30rem;
  height: 3rem;
  line-height: 2rem;
  @media screen and (max-width: 768px) {
    & {
      font-size: 1.3rem;
      width: fit-content;
    }
  }
`;

const SubTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
`;

const ChatContent = styled(Chatting)`
  width: 100%;
`;
let socket: any = null;

interface StateType {
  room_id: string;
}

const Room = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useAppSelector(userIsLogin);
  const state = location.state as StateType;
  let room_id = state.room_id;

  const email = useAppSelector(userEmail);
  const [text, setText] = useState<string>(''); // ????????? ?????? ?????????
  const [talkContents, setTalkContents] = useState<MessageType[]>([]);
  const [memberList, setMemberList] = useState<UserType[]>([]);
  const [category, setCategory] = useState<string>('');
  const [roomLocation, setRoomLocation] = useState<string>('');
  const [attendMembers, setAttendMembers] = useState<UserType[]>([]);

  useEffect(() => {
    const roomData = async () => {
      try {
        const {
          data: {
            data: { Messages, Participants, category_id, location },
          },
        } = await roomAPI.getRoomInfo(room_id, email);
        setTalkContents(Messages);
        setRoomLocation(location);
        const members = Participants.map((member: any) => {
          return member.User;
        });
        setMemberList(members);
        dispatch(setParticipant(Participants));

        const {
          data: {
            data: { categoryList },
          },
        } = await categoryAPI.list();
        categoryList.filter((cat: CategoryType) => {
          if (category_id === cat.id) {
            setCategory(cat.name);
          }
        });
      } catch (error) {
        dispatch(showAlert('error'));
        console.log(error);
      }
    };
    if (room_id) {
      roomData();
    }
  }, []);

  useEffect(() => {
    const io = require('socket.io-client');
    socket = io(`${process.env.REACT_APP_SOCKET_URI}/chat`, {
      withCredentials: true,
      transports: ['websocket'],
      upgrade: false,
      rejectUnauthorized: false,
      forceNew: true,
    });
    socket.on('reject', (data: any) => {
      console.log(data.message);
      if (data.message === 'another client access') {
        navigate('/');
      }
      if (data.message === 'wait sec') {
        // const wakeUpTime: any = Date.now() + 2000;
        // while (Date.now() < wakeUpTime) {}
        // socket.emit('join_room', { email, room_id });
      }
    });
    socket.on('alarm_enter', (data: any) => {
      // todo - ?????? ????????? ????????????(?????? ???????????? ??????) ????????? ?????? - ?????? ????????? ?????? ! ???????????? ??????
      // ???????????? ?????? ????????????
      setAttendMembers(data.users);
      let message: MessageType = {
        id: -1,
        User: { email: 'ADMIN', nick_name: 'ADMIN', profile_image: 'ADMIN' },
        content: data.message,
        is_update: 'N',
        write_date: dateToString(new Date(), '-', true),
        isAlarm: true,
        message_type: 'ADMIN',
      };
      // ????????? ?????? ??????
      setTalkContents((item: Array<MessageType>) => [...item, message]);
      setMemberList((users: Array<UserType>) => {
        let find = users.find((item: UserType) => item.email === data.user.email);
        users = find ? users : [...users, data.user];
        return users;
      });
    });
    socket.on('msg_insert', (data: any) => {
      let { sender, message_type, message } = data;
      console.log(message_type);
      let getMessage = {
        id: data.message_id,
        User: sender,
        content: message,
        is_update: 'N',
        write_date: dateToString(new Date(), '-', true),
        isAlarm: false,
        message_type, // todo message type ?????? -IMAGE ??? ?????? ????????????
      };
      //???????????? ????????? ??????
      setTalkContents((item: Array<MessageType>) => [...item, getMessage]);
      console.log(talkContents);
    });
    socket.on('msg_update', (data: any) => {
      let { email, nick_name, profile_image } = data.sender;
      let getMessage = {
        id: data.message_id,
        User: {
          email,
          nick_name,
          profile_image,
        },
        content: data.message,
        is_update: 'Y',
        write_date: data.writeDate,
        isAlarm: false,
      };

      //???????????? ????????? ??????
      setTalkContents((item: Array<MessageType>): any => {
        return item.map((message: MessageType) => {
          return message.id === data.message_id ? getMessage : message;
        });
      });
    });
    socket.on('leave_room', (data: any) => {
      let { users, message } = data;
      let inputMessage: MessageType = {
        id: -1,
        User: { email: 'ADMIN', nick_name: 'ADMIN', profile_image: 'ADMIN' },
        content: message,
        is_update: 'N',
        write_date: dateToString(new Date(), '-', true),
        isAlarm: true,
        message_type: 'ADMIN',
      };
      // ???????????? ??????
      setTalkContents((item: Array<MessageType>) => [...item, inputMessage]);
      // ???????????? ?????? ????????????
      setAttendMembers(users);
    });
    socket.on('leave_meeting', (data: any) => {
      let { email, users, message } = data;
      let inputMessage: MessageType = {
        id: -1,
        User: { email: 'ADMIN', nick_name: 'ADMIN', profile_image: 'ADMIN' },
        content: message,
        is_update: 'N',
        write_date: dateToString(new Date(), '-', true),
        isAlarm: true,
        message_type: 'ADMIN',
      };
      // ???????????? ??????
      setTalkContents((item: Array<MessageType>) => [...item, inputMessage]);
      // ???????????? ?????? ????????????
      setAttendMembers(users);
      // ?????? ???????????? ?????? ?????? ??????
      setMemberList((item: Array<UserType>) => {
        return item.filter((user: UserType) => user.email !== email);
      });
    });
    socket.on('out', (data: any) => {
      navigate('/');
    });
    socket.emit('join_room', { room_id, email });
    return () => {
      socket.close();
    };
  }, []);
  /**
   * ?????? ????????? ????????? ?????? ??????
   * @param e event
   */
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  /**
   * ??? ??????????????? ????????? ???????????? ???????????? ?????????
   * @returns ?????????
   */
  const roomTitle = () => {
    return `#${category} #${roomLocation.split(' ').join('_')}`;
  };

  /**
   * ?????? ?????????
   */
  const handleQuit = async () => {
    try {
      await socket.emit('leave_meeting', { room_id, email });
      //navigate('/search'); // ?????? ?????? ???????????? ??????
    } catch (error) {
      dispatch(showAlert('error'));
      console.log(error);
    }
  };

  // todo message insert ????????? ?????? - ?????? ui??? ????????? ??????????????? ????????? - enter ??????
  const handleInsertMessage = () => {
    console.log('?????????');
    if (!text || text === '') {
      return;
    }
    socket.emit('msg_insert', { email, room_id, content: text });
    setText('');
  };

  //todo message update ????????? ?????? - ?????? ??? ??????
  const updateMessage = (content: string, message_id: number) => {
    socket.emit('msg_update', {
      room_id,
      email,
      content,
      message_id,
    });
  };
  const uploadImg = async (e: React.SyntheticEvent) => {
    const { files } = e.target as HTMLInputElement;

    if (files) {
      const formData = new FormData();
      formData.append('file', files[0]);
      try {
        const {
          data: { url },
        } = await roomAPI.sendImg(formData);
        socket.emit('msg_insert', {
          email,
          room_id,
          content: url,
          message_type: 'IMAGE',
        });
      } catch (err) {
        dispatch(showAlert('error'));
        console.log(err);
      }
    }
  };
  return (
    <>
      <Header />
      {isLogin ? (
        <Container>
          <ChatContainer>
            <RoomDetail>
              <GroupTitle>{roomTitle()}</GroupTitle>
            </RoomDetail>
            <ContentContainer>
              <ChatBox>
                <ChatContent
                  talkContents={talkContents}
                  text={text}
                  handleText={handleText}
                  handleQuit={handleQuit}
                  handleInsertMessage={handleInsertMessage}
                  updateMessage={updateMessage}
                  roomMember={memberList}
                  handleUploadImg={uploadImg}
                />
              </ChatBox>
              <MemberContainer className="drop-shadow">
                <SubTitle>?????? ??????</SubTitle>
                <MemberList roomMember={memberList} attendMembers={attendMembers} />
              </MemberContainer>
            </ContentContainer>
          </ChatContainer>
        </Container>
      ) : (
        <LoginConfirm />
      )}
    </>
  );
};

export default Room;
