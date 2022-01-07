import React from 'react';
import styled from 'styled-components';

const Menu = styled.div`
  margin-left: auto;
  position: absolute;
`;

const Container = styled.div`
  display: flex;
  padding: 0.4rem 1.3rem;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    &{Menu}::after {
      content: '\f141';
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
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

interface IMessage {
  messageData: {
    id: number;
    user: { email: string; nick_name: string; profile_img: string };
    content: string;
    isUpdate: string;
    writeDate: string;
  };
}

const Message = ({ messageData }: IMessage) => {
  const { id, user, content, isUpdate, writeDate } = messageData;
  return (
    <Container key={id}>
      <ImageContainer>
        <MImage url={user.profile_img} />
      </ImageContainer>
      <MainContent>
        <Title>
          <Name>{user.nick_name}</Name>
          <Date>{writeDate}</Date>
          <Edited>{isUpdate === 'N' ? '' : '(수정됨)'}</Edited>
          <Menu />
        </Title>
        <Content>{content}</Content>
      </MainContent>
    </Container>
  );
};

export default Message;
