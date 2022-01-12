import React, { useState } from 'react';
import styled from 'styled-components';
import { MessageType } from '../type';
import defaultImg from '../images/profile.png';
import { useAppSelector } from '../config/hooks';
import { userEmail } from '../reducers/userSlice';

const MenuContainer = styled.div`
  right: 2rem;
  height: 1rem;
  right: 0;
  margin-left: auto;
  display: none;
  justify-content: flex-end;
`;

const ChatMenu = styled.div`
  width: 2rem;
  font-size: 0.8rem;
  weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Report = styled(ChatMenu)`
  color: ${(props) => props.theme.color.sub.red};
`;

const Edit = styled(ChatMenu)`
  left: -2rem;
  color: ${(props) => props.theme.color.font};
`;

const Container = styled.div`
  display: flex;
  padding: 0.4rem 1.3rem;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    ${MenuContainer} {
      display: flex;
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
  width: 100%;
`;

const Date = styled.div`
  font-size: 0.85rem;
`;

const Content = styled.div``;

const Edited = styled.div`
  margin-left: 0.5rem;
  font-size: 0.7rem;
  line-height: 0.7rem;
`;

const EditForm = styled.form``;

const EditInput = styled.input`
  &:focus {
    outline: none;
  }
`;

interface MessageProps {
  messageData: MessageType;
  handleModal: any;
  updateMessage: any;
}

const Message = ({ messageData, handleModal, updateMessage }: MessageProps) => {
  const email = useAppSelector(userEmail);
  console.log(messageData);
  const { id, User, content, is_update, write_date, isAlarm } = messageData;
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
    setNewContent(newContent);
    setIsEdit(!isEdit);
    updateMessage(newContent, id);
  };

  /**
   * 메시지 & 메시지 수정 상태 관리
   */
  const handleEdit = () => {
    setNewContent(content);
    setIsEdit(!isEdit);
  };
  //유저 탈퇴할 경우 User 정보 불러올 수 없음 . 로직 약간 변경.
  return (
    <Container key={id}>
      <ImageContainer>
        <MImage url={User ? User.profile_image || defaultImg : defaultImg} />
      </ImageContainer>
      <MainContent>
        <Title>
          <Name>
            {User
              ? isAlarm
                ? ''
                : User.email === email
                ? '나'
                : User.nick_name
              : '(삭제된 유저)'}
          </Name>
          <Date>{write_date}</Date>
          <Edited>{is_update === 'N' ? '' : '(수정됨)'}</Edited>
          {isAlarm ? (
            ''
          ) : (
            <MenuContainer>
              {User ? (
                email !== User.email ? null : (
                  <Edit onClick={handleEdit}>수정</Edit>
                )
              ) : null}
              {User ? (
                email !== User.email ? (
                  <Report onClick={() => handleModal(User.nick_name, id)}>
                    신고
                  </Report>
                ) : null
              ) : null}
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
