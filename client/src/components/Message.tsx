import React, { FormEventHandler, useState } from 'react';
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
    text-decoration: underline;
    ${MenuContent} {
      display: flex;
    }
  }
`;

const Edit = styled.div`
  margin-left: auto;
  position: absolute;
  left: -2rem;
  width: 2rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Container = styled.div`
  display: flex;
  padding: 0.4rem 1.3rem;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    ${Report}::after, ${Edit}::after {
      font-size: 0.8rem;
      weight: 600;
      cursor: pointer;
    }
    ${Report}::after {
      color: ${(props) => props.theme.color.sub.red};
      content: '신고';
    }
    ${Edit}::after {
      color: ${(props) => props.theme.color.font};
      content: '수정';
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
  display: flex;
`;

const EditForm = styled.form``;

const EditInput = styled.input``;

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
  updateMessage: any;
}

const Message = ({ messageData, handleModal, updateMessage }: IMessage) => {
  const { id, user, content, isUpdate, writeDate, isAlarm } = messageData;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(content);

  /**
   * 수정 중인 메시지 상태 관리
   * @param e
   */
  const handleNewContent = (e: React.SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    setNewContent(value);
  };

  const handleUpdate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    updateMessage(newContent, id);
  };

  /**
   * 메시지 & 메시지 수정 상태 관리
   */
  const handleEdit = () => {
    setNewContent(content);
    setIsEdit(!isEdit);
  };

  return (
    <Container key={id}>
      <ImageContainer>
        <MImage url={user && user.profile_image} />
      </ImageContainer>
      <MainContent>
        <Title>
          <Name>{isAlarm ? '' : user && user.nick_name}</Name>
          <Date>{writeDate}</Date>
          <Edited>{isUpdate === 'N' ? '' : '(수정됨)'}</Edited>
          {isAlarm ? (
            ''
          ) : (
            <MenuContainer>
              <Edit onClick={handleEdit} />
              <Report onClick={() => handleModal(user.nick_name, id)} />
            </MenuContainer>
          )}
        </Title>
        {isEdit ? (
          <EditForm onSubmit={handleUpdate}>
            <EditInput value={newContent} onChange={handleNewContent} />
          </EditForm>
        ) : (
          <Content>{content}</Content>
        )}
      </MainContent>
    </Container>
  );
};

export default Message;
