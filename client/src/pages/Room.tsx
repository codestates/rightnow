import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Chatting from '../components/Chatting';
import Header from '../components/layout/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-top: 6rem;
  background: ${(props) => props.theme.color.main};
  color: ${(props) => props.theme.color.font};
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    & {
      background-color: lightblue;
    }
  }
`;

const ChatContainer = styled.div`
  width: 60%;
  background: ${(props) => props.theme.color.sub.white};
  height: 48rem;
  padding: 2rem;
  box-shadow: 10px 10px 0 0 rgb(0, 0, 0, 0.4);
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
  padding: 0.5rem 0.5rem;
  margin-bottom: 0.3rem;
  box-shadow: 6px 6px 0 0 rgb(255, 99, 53, 0.4);
  width: 21rem;
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

const MemberContainer = styled.div`
  background-color: white;
  padding: 1rem 1.3rem;
  border-radius: 0.5rem;
  width: 30%;
  height: 38.3rem;
`;

const MemberList = styled.div`
  overflow-y: scroll;
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

const ChatBox = styled.div`
  width: 70%;
  margin-right: 1rem;
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

const Room = () => {
  const [text, setText] = useState<string>(''); // 채팅창 입력 메시지
  const [talkContents, setTalkContents] = useState<MessageType[]>([]);
  const [memberList, setMemberList] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTalkContents([
      {
        id: 1,
        user: {
          email: 'test@gmail.com',
          nick_name: '테스트',
          profile_img: 'https://via.placeholder.com/800x600',
        },
        content: '안녕하세요',
        isUpdate: 'N',
        writeDate: '2021-12-12',
      },
      {
        id: 2,
        user: {
          email: 'test@gmail.com',
          nick_name: '테스트',
          profile_img: 'https://via.placeholder.com/800x600',
        },
        content: '안녕하세요',
        isUpdate: 'N',
        writeDate: '2021-12-12',
      },
      {
        id: 3,
        user: {
          email: 'test@gmail.com',
          nick_name: '테스트',
          profile_img: 'https://via.placeholder.com/800x600',
        },
        content: '안녕하세요',
        isUpdate: 'N',
        writeDate: '2021-12-12',
      },
    ]);
  }, []);

  useEffect(() => {
    setMemberList([
      {
        email: 'test@gmail.com',
        nick_name: '테스트',
        profile_img: 'https://via.placeholder.com/800x600',
        enterDate: '2021-12-12',
        role: 'HOST',
      },
    ]);
  }, []);

  /**
   * 채팅 입력창 메시지 상태 관리
   * @param e event
   */
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
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
            {/** 위치와 카테고리로 모임 타이틀 표시 */}
            <GroupTitle>#서울시 #동대문구 #맛집</GroupTitle>
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
