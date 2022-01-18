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

function dateToString(
  date: Date,
  format: string = '',
  needTime: boolean = false,
): string {
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
  const [text, setText] = useState<string>(''); // 채팅창 입력 메시지
  const [talkContents, setTalkContents] = useState<MessageType[]>([]);
  const [memberList, setMemberList] = useState<UserType[]>([]);
  const [category, setCategory] = useState<string>('');
  const [roomLocation, setRoomLocation] = useState<string>('');
  const [attendMembers, setAttendMembers] = useState<UserType[]>([]);

  useEffect(() => {
    const roomData = async () => {
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
    };
    if (room_id) {
      roomData();
    }
  }, []);

  useEffect(() => {
    const io = require('socket.io-client');
    socket = io(`${process.env.REACT_APP_SOCKET_URI}/chat`, {
      withCredentials: true,
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
      // todo - 현재 채팅방 참가중인(모임 참가인원 아님) 인원들 추가 - 일단 추가해 놓음 ! 필요하면 사용
      // 참가중인 멤버 업데이트
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
      // 들어온 인원 알림
      setTalkContents((item: Array<MessageType>) => [...item, message]);
      setMemberList((users: Array<UserType>) => {
        let find = users.find(
          (item: UserType) => item.email === data.user.email,
        );
        users = find ? users : [...users, data.user];
        return users;
      });
    });
    socket.on('msg_insert', (data: any) => {
      let { email, nick_name, profile_image, message_type } = data.sender;
      let getMessage = {
        id: data.message_id,
        User: {
          email,
          nick_name,
          profile_image,
        },
        content: data.message,
        is_update: 'N',
        write_date: dateToString(new Date(), '-', true),
        isAlarm: false,
        message_type, // todo message type 추가 -IMAGE 일 경우 분기처리
      };
      //전달받은 메세지 추가
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

      //전달받은 메세지 변경
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
      // 나간인원 알림
      setTalkContents((item: Array<MessageType>) => [...item, inputMessage]);
      // 참가중인 멤버 업데이트
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
      // 나간인원 알림
      setTalkContents((item: Array<MessageType>) => [...item, inputMessage]);
      // 참가중인 멤버 업데이트
      setAttendMembers(users);
      // 멤버 목록에서 나간 유저 제외
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
   * 채팅 입력창 메시지 상태 관리
   * @param e event
   */
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  /**
   * 방 카테고리와 주소를 타이틀로 만들어서 반환함
   * @returns 타이틀
   */
  const roomTitle = () => {
    return `#${category} #${roomLocation.split(' ').join('_')}`;
  };

  /**
   * 모임 나가기
   */
  const handleQuit = async () => {
    await socket.emit('leave_meeting', { room_id, email });
    //navigate('/search'); // 모임 검색 페이지로 이동
  };

  // todo message insert 이벤트 추가 - 현재 ui에 텍스트 입력박스가 안보임 - enter 입력
  const handleInsertMessage = () => {
    console.log('보내기');
    if (!text || text === '') {
      return;
    }
    socket.emit('msg_insert', { email, room_id, content: text });
    setText('');
  };

  //todo message update 이벤트 추가 - 수정 후 엔터
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
                <SubTitle>대화 상대</SubTitle>
                <MemberList roomMember={memberList} />
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
