import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { roomAPI } from '../api/roomApi';
import { categoryAPI } from '../api/categoryApi';
import Dropdown from '../components/Dropdown';
import { useAppDispatch, useAppSelector } from '../config/hooks';
import { userEmail } from '../reducers/userSlice';
import ModalTemp from '../components/ModalTemp';
import MatchingModal from '../components/MatchingModal';
import {
  roomLat,
  roomLocation,
  roomLon,
  setLon,
  setLat,
  setLocation,
  setRoomCategory,
} from '../reducers/roomSlice';

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
  height: 40rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FrindContainer = styled.div`
  display: flex;
  width: 29rem;
  margin-bottom: 1rem;
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

const CategoryList = styled.div`
  margin-bottom: 1rem;
  height: 2.5rem;
`;

const Select = styled.select`
  width: 14rem;
  margin-left: 2rem;
  padding: 0.6rem 1.3rem 0.5rem 1.2rem;

  border: 1px solid #c0c0c0;
  border-radius: 0.4rem;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background: url() no-repeat 95% 50%;

  &::-ms-expand {
    display: none;
  }
  &:enabled {
    &:hover {
      border-color: rgba(0, 0, 0, 0.1);
      /* border: 2px solid; */
    }
  }

  &:focus {
    outline: none;
    border: 1px solid rgba(182, 80, 80);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
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
  width: 5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;

  display: inline-block;
`;

const FriendLabel = styled(Label)`
  width: 10rem;
  margin-right: 1rem;
`;

const FriendList = styled.div`
  height: 12rem;
  width: 15rem;
  overflow-y: scroll;
  background: rgba(0, 0, 0, 0.03);
  margin-left: -0.1rem;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
`;

const Friend = styled.div<{ checked: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
  background: ${(props) => (props.checked ? 'rgba(0, 0, 0, 0.1)' : '')};
  font-weight: ${(props) => (props.checked ? '600' : '')};
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`;

const FriendImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 2rem;
  height: 2rem;
  background-color: red;
  background-size: auto 100%;
  background-position: center;
  border-radius: 1.5rem;
  margin-right: 1rem;
`;

const FriendNick = styled.div``;

const Message = styled.div`
  height: 2rem;
  margin-top: -2rem;
`;

const Modal = styled(ModalTemp)``;

interface CategoryType {
  id: number;
  name: string;
  user_num: number;
  createdAt: string;
  updatedAt: string;
}

interface FriendType {
  profile_img: string;
  nick_name: string;
  email: string;
}

const initCategory = {
  id: -1,
  name: '',
  user_num: 0,
  createdAt: '',
  updatedAt: '',
};

const Search = () => {
  const dispatch = useAppDispatch();

  const email = useAppSelector(userEmail); // 사용자 이메일

  const [modalMessage, setModalMessage] = useState<string>(''); // 상태 메시지 모달 상태
  const [isMatching, setIsMatching] = useState<boolean>(false); // 매칭중 모달 상태

  const [category, setCategory] = useState<CategoryType[]>([]); // DB에서 가져온 카테고리 리스트
  const [friendList, setFriendList] = useState<FriendType[]>([]); // DB에서 가져온 친구 리스트
  const [selectedFriend, setSelectedFriend] = useState<string[]>([]); // 선택한 친구 리스트
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>(initCategory); // 선택한 카테고리 데이터
  const [message, setMessage] = useState<string>(''); // 상태메시지 (인원 제한, 카테고리 먼저 선택, 위치 필요(아직))

  const location = useAppSelector(roomLocation);
  const lat = useAppSelector(roomLat);
  const lon = useAppSelector(roomLon);

  /**
   * 친구 목록 가져오기
   */
  useEffect(() => {
    setFriendList([
      {
        nick_name: '김코딩',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com',
      },
      {
        nick_name: '김코딩2',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com2',
      },
      {
        nick_name: '김코딩3',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com3',
      },
      {
        nick_name: '김코딩4',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com4',
      },
      {
        nick_name: '김코딩5',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com5',
      },
      {
        nick_name: '김코딩6',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com6',
      },
      {
        nick_name: '김코딩7',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com7',
      },
      {
        nick_name: '김코딩8',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com8',
      },
      {
        nick_name: '김코딩9',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com9',
      },
      {
        nick_name: '김코딩10',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com10',
      },
      {
        nick_name: '김코딩11',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com11',
      },
      {
        nick_name: '김코딩12',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com12',
      },
      {
        nick_name: '김코딩13',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'test@gmail.com13',
      },
    ]);
  }, []);

  /**
   * 카테고리 가져오기
   */
  useEffect(() => {
    const categoryData = async () => {
      const {
        data: {
          data: { categoryList: data },
        },
      } = await categoryAPI.list();
      setCategory(data);
    };
    categoryData();
  }, []);

  /**
   * 사용자의 현재 위치 가져오기
   */
  useEffect(() => {
    const success = async (position: {
      coords: { latitude: number; longitude: number };
    }) => {
      const { latitude, longitude } = position.coords;
      dispatch(setLon(longitude));
      dispatch(setLat(latitude));
      // 가져온 위도 경도로 주소를 조회(서버 api 사용)
      const {
        data: { data },
      } = await roomAPI.location(longitude, latitude);
      dispatch(setLocation(data));
    };
    const error = () => {
      // 사용자가 위치 정보를 공유하지 않음
      // 브라우저가 위치를 가져올 수 없음
      // 타임아웃이 발생됨
      setModalMessage(`위치 정보를 가져올 수 없습니다.🥲\n권한을 확인해주세요.`);
      console.log('Unable to retrieve your location');
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      // geolocation을 지원하지 않는 경우
      error();
    }
  }, []);

  /**
   * 선택한 친구들이 정해진 인원보다 많은지 검사
   * 상황에 따라 메지시를 모여줌
   */
  const checkJoinNum = () => {
    if (selectedFriend.length >= selectedCategory.user_num - 1) {
      setMessage(
        `${selectedCategory.name}은 본인 포함 ${selectedCategory.user_num}명까지만 함께할 수 있어요!`,
      );
      return false;
    } else {
      setMessage('');
      return true;
    }
  };

  /**
   * 같이할 친구
   * selectedFriend 관리
   * @param e
   */
  const handleJoin = (e: MouseEvent<HTMLDivElement>) => {
    const friendEmail: string = e.currentTarget.title;
    if (selectedCategory.name === '') {
      setMessage('키테고리를 먼저 선택해주세요');
      return;
    }
    if (selectedFriend.includes(friendEmail)) {
      // 같이할 친구에서 빼기
      const idx: number = selectedFriend.indexOf(friendEmail);
      const newList: string[] = [...selectedFriend];
      setSelectedFriend([...newList.slice(0, idx), ...newList.slice(idx + 1)]);
    } else {
      // 같이할 친구에 추가
      // 선택한 친구 수 확인
      if (checkJoinNum()) {
        setSelectedFriend([...selectedFriend, e.currentTarget.title]);
      }
    }
  };

  /**
   * 선택된 카테고리 관리
   * @param e
   */
  const handleCategory = (e: ChangeEvent) => {
    const { value } = e.target as HTMLSelectElement;
    const selected = category[Number(value) - 1];
    if (!selected) {
      setSelectedCategory(initCategory);
    } else {
      setSelectedCategory(selected);
      dispatch(setRoomCategory(selected.name));
    }
    setSelectedFriend([]);
    setMessage('');
  };

  /**
   *  모임참가 버튼 클릭
   */
  const handleJoinRoom = () => {
    // category_id => selectedCategory.id
    // email_list => 같이할 친구들 => selectedFriend

    // location, lon, lat, email(사용자 이메일)은 state
    const category_id: number = selectedCategory.id;
    const email_list: string[] = [...selectedFriend];
    const type: string = email_list.length > 0 ? 'GROUP' : 'ALONE';

    const searchData = {
      category_id,
      email,
      email_list,
      type,
      location,
      lon,
      lat,
    }; // 모임을 참가할 때 필요한 데이터들

    // 모임 찾기

    if (category_id !== -1) {
      // 필요한 조건을 전부 선택하고,
      // 방이 만들어지면
      setIsMatching(true); // 매칭으로 넘어감
    }
  };

  /**
   * searching을 끝냄
   */
  const handleMatching = () => {
    setIsMatching(false); // 모달 창을 닫음
  };

  return (
    <Container>
      {modalMessage.length > 0 ? <Modal>{modalMessage}</Modal> : <></>}
      {isMatching ? <MatchingModal handleMatching={handleMatching} /> : <></>}
      <SearchContainer>
        <TitleContainer>
          <Title># 모임 찾기</Title>
        </TitleContainer>
        <OptionContainer>
          <Message>{message}</Message>
          {/* <Dropdown optionList={category} /> */}
          <CategoryList>
            <Label htmlFor="category">카테고리</Label>
            <Select className="" id="category" onChange={handleCategory}>
              <Option>카테고리를 선택해주세요</Option>
              {category.length > 0 &&
                category.map((item, idx) => (
                  <Option key={idx} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </CategoryList>
          <Location>
            <Label htmlFor="location">현재 위치</Label>
            <Select id="location" disabled>
              <Option>{location}</Option>
            </Select>
          </Location>
          <FrindContainer>
            <FriendLabel>친구와 함께하기</FriendLabel>
            <FriendList>
              {friendList.map((friend: FriendType) => {
                if (selectedFriend.includes(friend.email)) {
                  return (
                    <Friend
                      title={friend.email}
                      onClick={handleJoin}
                      key={friend.email}
                      checked={true}
                    >
                      <FriendImg>
                        <Image src={friend.profile_img} />
                      </FriendImg>
                      <FriendNick>{friend.nick_name}</FriendNick>
                    </Friend>
                  );
                } else {
                  return (
                    <Friend
                      title={friend.email}
                      onClick={handleJoin}
                      key={friend.email}
                      checked={false}
                    >
                      <FriendImg>
                        <Image src={friend.profile_img} />
                      </FriendImg>
                      <FriendNick>{friend.nick_name}</FriendNick>
                    </Friend>
                  );
                }
              })}
            </FriendList>
          </FrindContainer>
          <ButtonContainer>
            <Button onClick={handleJoinRoom}>모임 찾기</Button>
          </ButtonContainer>
        </OptionContainer>
      </SearchContainer>
    </Container>
  );
};

export default Search;
