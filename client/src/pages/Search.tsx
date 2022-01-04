import axios from 'axios';
import React, { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api/categoryApi';
import Dropdown from '../components/Dropdown';

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

const SearchContainer = styled.div`
  width: 60%;
  background: ${(props) => props.theme.color.sub.white};
  height: 48rem;
  padding: 2rem;
  box-shadow: 10px 10px 0 0 rgb(0, 0, 0, 0.4);
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

const TitleContainer = styled.div``;

const OptionContainer = styled.div`
  width: 100%;
  height: 24rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FrindContainer = styled.div``;

const ButtonContainer = styled.div``;

const Button = styled.button`
  width: 14rem;
  height: 2.2rem;
  border-radius: 3px;
  background: ${(props) => props.theme.color.main};
  color: black;
`;

const CategoryList = styled.div`
  margin-bottom: 1rem;
  height: 2.5rem;
`;

const Select = styled.select`
  width: 14rem;
  margin-left: 2rem;
  padding: 0.5rem 1.4rem 0.5rem 1.9rem;

  border: 1px solid #aaa;
  border-radius: 0.4rem;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background: url() no-repeat 95% 50%;

  &::-ms-expand {
    display: none;
  }

  &:hover {
    border-color: #888;
    border: 2px solid;
  }

  &:focus {
    outline: none;
    border: 1px solid rgba(182, 80, 80);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const Option = styled.option`
  padding: 0.7rem 1rem;
`;

const Location = styled.div`
  margin-bottom: 1.5rem;
  height: 2.5rem;
`;

const Label = styled.label`
  width: 4rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;

  display: inline-block;
`;

const FriendLabel = styled(Label)`
  width: 10rem;
`;

const FriendList = styled.div``;

interface ItemType {
  id: number;
  name: string;
  user_num: number;
  createdAt: string;
  updatedAt: string;
}

interface FriendType {
  id: number;
  email: string;
}

const Search = () => {
  const [category, setCategory] = useState<ItemType[]>([]);
  const [friendList, setFriendList] = useState<FriendType[]>([]);

  /**
   * 카테고리 가져오기
   */
  useEffect(() => {
    api('categoryList', undefined, (status: string, data: ItemType[]) => {
      setCategory(data);
    });
  }, []);

  /**
   * 사용자의 현재 위치 가져오기
   */
  useEffect(() => {
    const success = (position: {
      coords: { latitude: number; longitude: number };
    }) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      // 가져온 위도 경도로 주소를 조회(서버 api 사용)
    };
    const error = () => {
      // 사용자가 위치 정보를 공유하지 않음
      // 브라우저가 위치를 가져올 수 없음
      // 타임아웃이 발생됨
      console.log('Unable to retrieve your location');
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      // geolocation을 지원하지 않는 경우
    }
  }, []);

  return (
    <Container>
      <SearchContainer>
        <TitleContainer>
          <Title># 모임 찾기</Title>
        </TitleContainer>
        <OptionContainer>
          {/* <Dropdown optionList={category} /> */}
          <CategoryList>
            <Label htmlFor="category">카테고리</Label>
            <Select className="" id="category">
              <Option>-- 선택하세요 --</Option>
              {category.length > 0 &&
                category.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
            </Select>
          </CategoryList>
          <Location>
            <Label htmlFor="location">현재 위치</Label>
            <Select id="location" disabled>
              <Option></Option>
            </Select>
          </Location>
          <FrindContainer>
            <FriendLabel>친구와 함께하기</FriendLabel>
            <FriendList></FriendList>
          </FrindContainer>
          <ButtonContainer>
            <Button>모임 찾기</Button>
          </ButtonContainer>
        </OptionContainer>
      </SearchContainer>
    </Container>
  );
};

export default Search;
