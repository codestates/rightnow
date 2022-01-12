import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { roomAPI } from '../api/roomApi';
import { useAppDispatch, useAppSelector } from '../config/hooks';
import { userEmail } from '../reducers/userSlice';
import Message from './Message';
import ModalTemp from './ModalTemp';
import { MessageType } from '../type';
import Map from './Map';

const ChattingContainer = styled.div`
  height: 100%;
  overflow-y: hidden;
`;

const Chatting = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 0.3rem;
  overflow-y: scroll;
  overflow-x: hidden;
  /* margin-bottom: 1rem; */
  padding-top: 0.3rem;

  &::-webkit-scrollbar {
    width: 0.3rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    padding: 1rem;
  }
`;

const Container = styled.div`
  height: 100%;

  @media screen and (max-width: 1200px) {
    & {
    }
  }
  @media screen and (max-width: 992px) {
    & {
    }
  }
  @media screen and (max-width: 768px) {
    & {
    }
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
  transition: all 0.3s ease-in-out;

  display: ${(props) => (props.htmlFor === 'member' ? 'none' : '')};

  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    & {
      display: block;
    }
  }
`;

const Radio = styled.input`
  position: absolute;
  opacity: 0;
  &:checked + label {
    &{NavItem} {
      height: 2.3rem;
      width: 8rem;
      margin-top: -0.5rem;
      /* font-weight: 600; */
      line-height: 2.3rem;
      font-size: 1.1rem;
      box-shadow: inset 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    }
    &{NavItem}:hover {
      cursor: default;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 0.4rem 0.4rem;
`;

const QuitBtn = styled.button`
  background: ${(props) => props.theme.color.sub.red};
  width: 13rem;
  height: 2.3rem;
  border-radius: 3px;
`;

const QuitMessage = styled.div`
  padding-top: 3rem;
  width: 25rem;
  padding-bottom: 1.5rem;
  white-space: pre-line;
`;

const ReportConfirm = styled(ModalTemp)``;

const ReportContent = styled.div``;

const ReportMessage = styled.div``;

const ButtonContainer = styled.div``;

const ReportBtn = styled.button`
  background: ${(props) => props.theme.color.sub.red};
  color: white;
`;

const CancelBtn = styled.button``;

const WarningIcon = styled.div`
  font-size: 3em;
  text-align: center;
  margin-bottom: 1rem;
  &::after {
    content: '\f071';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    color: black;
  }
`;

const WarningMessage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChattingForm = styled.form`
  margin-top: 1rem;
`;

const AlwaysScrollToBottom = styled.span`
  height: 0rem;
  width: 0rem;
`;

interface ChattingProps {
  text: string;
  handleText: ChangeEventHandler<HTMLInputElement>;
  talkContents: MessageType[];
  handleQuit: MouseEventHandler<HTMLButtonElement>;
  handleInsertMessage: any;
  updateMessage: any;
}

const ChattingRoom = ({
  talkContents,
  text,
  handleText,
  handleQuit,
  handleInsertMessage,
  updateMessage,
}: ChattingProps) => {
  const [menu, setMenu] = useState<string>('talk'); // 메뉴 클릭, 대화, 모임위치, 나가기
  const email = useAppSelector(userEmail);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [reportNick, setReportNick] = useState<string>('');
  const [reportMessage, setReportMessage] = useState<number>(-1);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    scrollToBottom();
  }, [talkContents]);

  const scrollToBottom = () => {
    if (editMode) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollRef.current?.scrollIntoView();
    }
  };

  const handleMessage = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleInsertMessage();
    setEditMode(true);
  };

  const handleMenu = (e: any) => {
    setMenu(e.target.value);
  };

  const handleReport = async (message_id: number) => {
    const result = await roomAPI.report(message_id, email);
    console.log(result);
    handleModal('', -1);
  };

  const handleModal = (nickName: string, id: number) => {
    setReportMessage(id);
    setReportNick(nickName);
    setIsShow((prev) => !prev);
  };

  return (
    <Container className="flex flex-col">
      {isShow && (
        <ReportConfirm>
          <ReportContent>
            <ReportMessage className="pb-6 pt-3 w-56">
              <span className="font-bold">{reportNick}</span>을(를) 신고할까요?
            </ReportMessage>
            <ButtonContainer>
              <ReportBtn
                className="mr-4 rounded w-16 h-8 hover:bg-red-700 transition-colors"
                onClick={() => handleReport(reportMessage)}
              >
                신고
              </ReportBtn>
              <CancelBtn
                className="rounded w-16 h-8 bg-gray-200 hover:bg-gray-300 transition-colors"
                onClick={() => handleModal('', -1)}
              >
                취소
              </CancelBtn>
            </ButtonContainer>
          </ReportContent>
        </ReportConfirm>
      )}
      <Content className="drop-shadow">
        <RoomNav>
          <Radio
            type="radio"
            onClick={handleMenu}
            value="talk"
            id="talk"
            name="menu"
            defaultChecked={menu === 'talk'}
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
            defaultChecked={menu === 'map'}
          />
          <NavItem htmlFor="map" back="yellow">
            모임위치
          </NavItem>
          <NavItem htmlFor="member" back="yellow">
            대화 상대
          </NavItem>
          <Radio
            type="radio"
            onClick={handleMenu}
            value="quit"
            id="quit"
            name="menu"
            defaultChecked={menu === 'quit'}
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
                talkContents.map((messageData: MessageType, idx) => (
                  <Message
                    key={idx}
                    messageData={messageData}
                    handleModal={handleModal}
                    updateMessage={updateMessage}
                  ></Message>
                ))
              ) : (
                <div>아직 메시지가 없습니다. 대회를 시작해보세요!</div>
              )}
              <AlwaysScrollToBottom ref={scrollRef} />
            </Chatting>
          </ChattingContainer>
          <ChattingForm onSubmit={handleMessage}>
            <ChattingInput
              className="drop-shadow focus:drop-shadow-lg"
              onChange={handleText}
              value={text}
              placeholder="메세지 보내기"
              autoFocus
            />
          </ChattingForm>
        </>
      ) : menu === 'map' ? (
        <MenuContainer className="drop-shadow">
          <Map />
        </MenuContainer>
      ) : (
        <MenuContainer className="drop-shadow">
          <QuitMessage>
            <WarningIcon></WarningIcon>
            <WarningMessage>
              <div className="pb-2">
                나가면 같은 모임으로 다시 입장할 수 없어요.
              </div>
              <div>
                (일회용 계정을 사용한 경우, 모임을 나가면 계정이 삭제돼요.)
              </div>
            </WarningMessage>
          </QuitMessage>
          <QuitBtn
            className="text-stone-50 shadow-md hover:bg-red-500 transition-colors"
            onClick={handleQuit}
          >
            나가기
          </QuitBtn>
        </MenuContainer>
      )}
    </Container>
  );
};

export default ChattingRoom;
