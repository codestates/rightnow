import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-top: 6rem;
  background: ${(props) => props.theme.color.main};
  color: ${(props) => props.theme.color.subFont};

  @media only screen and (max-width: 600px) {
    & {
      background-color: lightblue;
    }
  }
`;

const MatchContainer = styled.div`
  width: 60%;
  background: ${(props) => props.theme.color.sub.white};
  height: 48rem;
  padding: 2rem;
  box-shadow: 10px 10px 0 0 rgb(0, 0, 0, 0.4);
`;

const TitleContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.div`
  font-size: 1.5rem;
  background: #e83635;
  color: black;
  padding: 0.5rem 0.5rem;
  margin-bottom: 0.3rem;
  box-shadow: 6px 6px 0 0 rgb(232, 54, 53, 0.4);
  width: 15rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  height: 30rem;
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

const Matching = () => {
  const [joinCnt, setJoinCnt] = useState<number>(5); // 모인 인원
  const [maxCnt, setMaxCnt] = useState<number>(7); // 채워져야 하는 인원

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

  return (
    <Container>
      <MatchContainer>
        <TitleContainer>
          <Title># 모임 찾기</Title>
        </TitleContainer>
        <LoadingContainer>
          <RoomTitle>#카테고리 #서울시 #은평구</RoomTitle>
          <Loading>
            {JoinDisplay()}
            {/* <Join>
              <Item></Item>
            </Join>
            <Join>
              <Item></Item>
            </Join>
            <Join>
              <Item></Item>
            </Join>
            <Join>
              <Item></Item>
            </Join>*/}
          </Loading>
        </LoadingContainer>
      </MatchContainer>
    </Container>
  );
};

export default Matching;
