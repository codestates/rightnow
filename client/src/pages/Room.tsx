import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { categoryAPI } from '../api/categoryApi';
import { roomAPI } from '../api/roomApi';
import Chatting from '../components/Chatting';
import Header from '../components/layout/Header';

const MemberContainer = styled.div`
  background-color: white;
  padding: 1rem 1.3rem;
  border-radius: 0.5rem;
  width: 30%;
  height: 38.3rem;
`;

const ChatBox = styled.div`
  width: 70%;
  margin-right: 1rem;
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
  height: 48rem;
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
`;

const GroupTitle = styled.div`
  font-size: 1.5rem;
  background: ${(props) => props.theme.color.main};
  color: black;
  padding: 0.5rem 0.8rem;
  margin-bottom: 0.3rem;
  box-shadow: 6px 6px 0 0 rgb(255, 99, 53, 0.4);
  width: 30rem;
  height: 3rem;
  line-height: 2rem;
`;

const ProfileMenu = styled.div`
  margin-left: auto;
`;

const ProfileName = styled.div`
  font-size: 1.1rem;
`;

const SubTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
`;

const ImageContainer = styled.div``;

const ProfileImg = styled.div<{ url: string }>`
  width: 3rem;
  height: 3rem;
  background-color: red;
  background-size: auto 100%;
  background-position: center;
  background-image: url(${(props) => props.url});
  border-radius: 1.5rem;
  margin-right: 1rem;
`;

const MemberList = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  height: 95%;
  margin-top: 0.6rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    padding: 1rem;
  }
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.3rem;
  transition: background 0.2s ease-in;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ChatContent = styled(Chatting)`
  width: 100%;
`;

interface User {
  email: string;
  nick_name: string;
  profile_img: string;
  enterDate: string;
  role: string;
}

interface MessageType {
  id: number;
  user: { email: string; nick_name: string; profile_img: string };
  content: string;
  isUpdate: string;
  writeDate: string;
}

interface StateType {
  room_id: string;
}

interface CategoryType {
  id: number;
  name: string;
  user_num: number;
  createdAt: string;
  updatedAt: string;
}

const Room = () => {
  const location = useLocation();
  // const state = location.state as StateType;
  // const { room_id } = state;

  const [text, setText] = useState<string>(''); // 채팅창 입력 메시지
  const [talkContents, setTalkContents] = useState<MessageType[]>([]);
  const [memberList, setMemberList] = useState<User[]>([]);
  const [category, setCategory] = useState<string>('');
  const [roomLocation, setRoomLocation] = useState<string>('');

  const navigate = useNavigate();
  // useEffect(() => {
  //   const roomData = async () => {
  //     const {
  //       data: {
  //         data: { Messages, Participants, category_id, location },
  //       },
  //     } = await roomAPI.getRoomInfo(room_id);
  //     setTalkContents(Messages);
  //     setRoomLocation(location);

  //     const members = Participants.map((member: any) => {
  //       return member.User;
  //     });
  //     setMemberList(members);

  //     const {
  //       data: {
  //         data: { categoryList },
  //       },
  //     } = await categoryAPI.list();
  //     categoryList.filter((cat: CategoryType) => {
  //       if (category_id === cat.id) {
  //         setCategory(cat.name);
  //       }
  //     });
  //   };
  //   roomData();
  // }, [room_id]);

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
  const handleQuit = () => {
    navigate('/search'); // 모임 검색 페이지로 이동
  };

  return (
    <>
      <Header />
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
              />
            </ChatBox>
            <MemberContainer className="drop-shadow">
              <SubTitle>대화 상대</SubTitle>
              <MemberList>
                {memberList && memberList.length > 0 ? (
                  memberList.map((member: User) => {
                    return (
                      <Member key={member.email}>
                        <ImageContainer>
                          <ProfileImg url={member.profile_img} />
                        </ImageContainer>
                        <ProfileName>{member.nick_name}</ProfileName>
                      </Member>
                    );
                  })
                ) : (
                  <div>대화 상대가 없습니다.</div>
                )}
              </MemberList>
            </MemberContainer>
          </ContentContainer>
        </ChatContainer>
      </Container>
    </>
  );
};

export default Room;
