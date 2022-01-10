import React from 'react';
import styled from 'styled-components';

const MenuContent = styled.div`
  position: absolute;
  top: 1rem;

  display: hidden;
  justify-content: center;
  align-items: center;
  width: 6.5rem;
  height: 2.6rem;
  background: gray;
  border-radius: 4px;
`;

const Report = styled.div`
  margin-left: auto;
  position: absolute;
  width: 2rem;
  &:hover {
    ${MenuContent} {
      display: flex;
    }
  }
`;

const Container = styled.div`
  display: flex;
  padding: 0.4rem 1.3rem;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    ${Report}::after {
      content: '신고';
      font-size: 0.8rem;
      color: ${(props) => props.theme.color.sub.red};
      weight: 600;
      cursor: pointer;
    }
  }
`;

const Name = styled.div`
  font-weight: 600;
  margin-right: 0.5rem;
`;

const ImageContainer = styled.div``;

const MImage = styled.div<{ url: string }>`
  background-image: url(${(props) => props.url});
  background-size: auto 100%;
  background-position: center;
  width: 3rem;
  height: 3rem;
  border-radius: 2rem;
  margin-top: 0.4rem;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.7rem;
  padding: 0.5rem 0.3rem;
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
  height: 1.3rem;
`;

const Date = styled.div`
  font-size: 0.85rem;
`;

const Content = styled.div``;

const Edited = styled.div``;

const MenuContainer = styled.div`
  position: absolute;
  right: 2rem;
  height: 1rem;
  width: 1rem;
`;

interface IMessage {
  messageData: {
    id: number;
    user: { email: string; nick_name: string; profile_image: string }; // fix - profile_img -> profile_image
    content: string;
    isUpdate: string;
    writeDate: string;
    isAlarm?: boolean; // fix - 채팅방 알람타입 인지 확인위해 (유저 입장, 퇴장 시)
  };
  handleModal: any;
}

const Message = ({ messageData, handleModal }: IMessage) => {
  const { id, user, content, isUpdate, writeDate, isAlarm } = messageData;

  return (
    <Container key={id}>
      <ImageContainer>
        <MImage url={user.profile_image} />
      </ImageContainer>
      <MainContent>
        <Title>
          <Name>{isAlarm ? '' : user.nick_name}</Name>
          <Date>{writeDate}</Date>
          <Edited>{isUpdate === 'N' ? '' : '(수정됨)'}</Edited>
          <MenuContainer>
            {isAlarm ? (
              ''
            ) : (
              <Report onClick={() => handleModal(user.nick_name, id)} />
            )}
          </MenuContainer>
        </Title>
        <Content>{content}</Content>
      </MainContent>
    </Container>
  );
};

export default Message;
