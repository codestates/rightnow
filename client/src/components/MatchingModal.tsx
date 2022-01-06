import React, {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import ModalTemp from '../components/ModalTemp';
import { useAppSelector } from '../config/hooks';
import { roomCategory, roomLocation } from '../reducers/roomSlice';

const Container = styled(ModalTemp)`
  @media only screen and (max-width: 600px) {
    & {
      background-color: lightblue;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  width: 30rem;
  height: 25rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const RoomTitle = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.7rem;
`;

const Loading = styled.div`
  padding: 1.5rem 1rem;
  border-radius: 5px;
  background: ${(props) => props.theme.color.gray};
  width: 25rem;
  min-height: 10rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  grid-auto-rows: 3rem;
  margin-bottom: 1rem;
`;

const Join = styled.div`
  display: flex;
  justify-content: center;
`;

const Item = styled.div<{ type: string }>`
  width: 2.5rem;
  height: 2.5rem;
  background: ${(props) =>
    props.type === 'empty' ? 'gray' : props.theme.color.main};
  border-radius: 1.5rem;
`;

const ButtonContainer = styled.div``;

const Button = styled.button`
  width: 14rem;
  height: 2.2rem;
  border-radius: 3px;
  background: ${(props) => props.theme.color.main};
  color: black;

  &:active {
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
  }
`;

interface ModalProps {
  handleMatching: MouseEventHandler;
}

const MatchingModal = ({ handleMatching }: ModalProps) => {
  const location = useAppSelector(roomLocation);
  const category = useAppSelector(roomCategory);
  const [joinCnt, setJoinCnt] = useState<number>(0); // 모인 인원
  const [maxCnt, setMaxCnt] = useState<number>(0); // 채워져야 하는 인원
  const navigate = useNavigate();

  /**
   * 사람이 모이는게 보이게 함(테스트용)
   */
  useEffect(() => {
    console.log(joinCnt);
    const increase = setInterval(() => setJoinCnt(joinCnt + 1), 1000);
    return () => clearInterval(increase);
  }, [joinCnt]);

  /**
   * 채워져야 하는 인원
   */
  useEffect(() => {
    setMaxCnt(11);
  }, []);

  /**
   * 현재 모인 인원
   */
  useEffect(() => {
    setJoinCnt(1);
  }, []);

  /**
   * 모인 인원을 확인하다가 모임이 다 차면 채팅 방으로 넘어감
   */
  useEffect(() => {
    if (maxCnt !== 0 && joinCnt === maxCnt) {
      navigate('/room');
    }
    JoinDisplay();
  }, [joinCnt]);

  /**
   * joinCnt(모인 인원)와 maxCnt(모임의 최대 인원)로 현재 채워진 인원을 표시함
   *
   * @returns 채워진 인원을 표시
   */
  const JoinDisplay = (): ReactNode[] => {
    let result: ReactNode[] = [];
    for (let idx = 0; idx < maxCnt; idx++) {
      if (joinCnt > idx) {
        result.push(
          <Join>
            <Item type="join"></Item>
          </Join>,
        );
      } else {
        result.push(
          <Join>
            <Item type="empty"></Item>
          </Join>,
        );
      }
    }
    return result;
  };

  /**
   * 방 카테고리와 주소를 타이틀로 만들어서 반환함
   * @returns 타이틀
   */
  const roomTitle = () => {
    return `#${category} #${location.split(' ').join('_')}`;
  };

  return (
    <Container>
      <LoadingContainer>
        <RoomTitle>{roomTitle()}</RoomTitle>
        <Loading>{JoinDisplay()}</Loading>
        <ButtonContainer>
          <Button onClick={handleMatching}>뒤로가기</Button>
        </ButtonContainer>
      </LoadingContainer>
    </Container>
  );
};

export default MatchingModal;
