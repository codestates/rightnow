import React, { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import styled from 'styled-components';
import Message from './Message';

const Container = styled.div`
  display: flex;
  height: 80%;
  flex-direction: column;
`;

const ChattingContainer = styled.div``;

const Chatting = styled.div`
  width: 100%;
  height: 32rem;
  background-color: white;
  border-radius: 0.3rem;
  overflow-y: scroll;
  margin-bottom: 1rem;

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

const ChattingInput = styled.input`
  width: 100%;
  height: 3rem;
  border-radius: 0.5rem;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  max-height: 10rem;

  &:focus {
    outline: none;
  }

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

const RoomNav = styled.div`
  display: flex;
  width: 100%;
`;

const NavItem = styled.label<{ back: any }>`
  height: 1.8rem;
  line-height: 1.8rem;
  width: 6.7rem;
  text-align: center;
  margin-right: 0.7rem;
  border-radius: 12px 12px 0px 0px;
  background: ${({ theme, back }) => theme.color.sub[back]};
  color: ${({ back }) => {
    if (back === 'brown') {
      return 'white';
    } else {
      return 'black';
    }
  }};
  transition: 0.3s;
  box-shadow: 2px 0px 2px rgba(0, 0, 0, 0.2);
`;

const Radio = styled.input`
  position: absolute;
  opacity: 0;
  &:checked + label {
    &{NavItem} {
      height: 2.1rem;
      width: 7.2rem;
      margin-top: -0.3rem;
      /* font-weight: 600; */
      line-height: 2rem;
      font-size: 1.1rem;
      box-shadow: 2px 3px 4px rgba(0, 0, 0, 0.5);
    }
  }
`;

const Content = styled.div`
  padding-top: 1rem;
  border-radius: 0.4rem 0.4rem 0 0;
  background: ${(props) => props.theme.color.gray};
`;

const MenuContainer = styled.div`
  background: white;
  height: 45rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuitBtn = styled.button`
  width: 13rem;
  height: 2.3rem;
  background: ${(props) => props.theme.color.sub.orange};
  color: black;
  border-radius: 3px;
`;

const QuitMessage = styled.div`
  padding-top: 3rem;
  width: 25rem;
  padding-bottom: 2rem;
  white-space: pre-line;
`;

interface ChattingProps {
  text: string;
  handleText: ChangeEventHandler<HTMLInputElement>;
  talkContents: MessageType[];
  handleQuit: MouseEventHandler<HTMLButtonElement>;
}

interface MessageType {
  id: number;
  user: { email: string; nick_name: string; profile_img: string };
  content: string;
  isUpdate: string;
  writeDate: string;
}

const ChattingRoom = ({
  talkContents,
  text,
  handleText,
  handleQuit,
}: ChattingProps) => {
  const [menu, setMenu] = useState<string>('talk'); // 메뉴 클릭, 대화, 모임위치, 나가기

  const handleMenu = (e: any) => {
    setMenu(e.target.value);
  };

  return (
    <Container>
      <Content>
        <RoomNav>
          <Radio
            type="radio"
            onClick={handleMenu}
            value="talk"
            id="talk"
            name="menu"
            checked={menu === 'talk'}
          />
          <NavItem htmlFor="talk" back="brown">
            대화
          </NavItem>
          <Radio
            type="radio"
            onClick={handleMenu}
            value="map"
            id="map"
            name="menu"
            checked={menu === 'map'}
          />
          <NavItem htmlFor="map" back="pink">
            모임위치
          </NavItem>
          <Radio
            type="radio"
            onClick={handleMenu}
            value="quit"
            id="quit"
            name="menu"
            checked={menu === 'quit'}
          />
          <NavItem htmlFor="quit" back="orange">
            나가기
          </NavItem>
        </RoomNav>
      </Content>
      {menu === 'talk' ? (
        <>
          <ChattingContainer className="drop-shadow">
            <Chatting>
              {talkContents && talkContents.length > 0 ? (
                talkContents.map((messageData: any) => (
                  <Message messageData={messageData}></Message>
                ))
              ) : (
                <div>아직 메시지가 없습니다. 대회를 시작해보세요!</div>
              )}
            </Chatting>
          </ChattingContainer>
          <ChattingInput
            className="drop-shadow focus:drop-shadow-lg"
            onChange={handleText}
            value={text}
          />
        </>
      ) : menu === 'map' ? (
        <MenuContainer>모임 위치(지도 표시)</MenuContainer>
      ) : (
        <MenuContainer>
          <QuitMessage>
            {`한 번 나간 모임은 다시 입장할 수 없습니다. 
            일회용 계정을 사용하신 경우 모임에서 나가면 해당 계정은 삭제됩니다.`}
          </QuitMessage>
          <QuitBtn onClick={handleQuit}>나가기</QuitBtn>
        </MenuContainer>
      )}
    </Container>
  );
};

export default ChattingRoom;
