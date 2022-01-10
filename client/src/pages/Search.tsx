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
  roomMaxCnt,
  setJoinCnt,
  setMaxCnt,
  roomJoinCnt,
} from '../reducers/roomSlice';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router';
import { showAlert } from '../reducers/componetSlice';
import Header from '../components/layout/Header';
import Alert from '../components/Alert';
import { KeyboardReturnOutlined } from '@material-ui/icons';
import { findAllByAltText } from '@testing-library/react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-top: 6rem;
  background: ${(props) => props.theme.color.main};
  color: #494949;

  @media only screen and (max-width: 768px) {
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
  margin-bottom: 2.6rem;
`;

const ButtonContainer = styled.div``;

const Button = styled.button`
  width: 15rem;
  height: 2.2rem;
  border-radius: 3px;
  background: ${(props) => props.theme.color.main};
  color: black;
  transition: 0.2s;

  &:active {
    background: rgb(211, 76, 52);
  }

  &:hover {
    opacity: 0.95;
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
  color: ${(props) => props.theme.color.sub.red};
`;

const Modal = styled(ModalTemp)``;

const Searching = styled(Loading)`
  display: flex;
  flex-direaction: column;
`;

const CancelBtn = styled.button`
  width: 10rem;
  height 2rem;
  color: black;
  background: ${(props) => props.theme.color.sub.yellow};
  margin-top: 2rem;
`;

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

let socket: any = null;

const Search = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector(userEmail); // 사용자 이메일

  const [modalMessage, setModalMessage] = useState<string>(''); // 상태 메시지 모달 상태
  const [isMatching, setIsMatching] = useState<boolean>(false); // 매칭중 모달 상태
  const [isSearching, setIsSearching] = useState<boolean>(false); // 방 찾는 중 상태

  const [category, setCategory] = useState<CategoryType[]>([]); // DB에서 가져온 카테고리 리스트
  const [friendList, setFriendList] = useState<FriendType[]>([]); // DB에서 가져온 친구 리스트
  const [selectedFriend, setSelectedFriend] = useState<string[]>([]); // 선택한 친구 리스트
  const [visibleFriend, setVisibleFriend] = useState<FriendType[]>([]); // 보여질 친구 리스트
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>(initCategory); // 선택한 카테고리 데이터
  const [message, setMessage] = useState<string>(''); // 상태메시지 (인원 제한, 카테고리 먼저 선택, 위치 필요(아직))
  const [search, setSearch] = useState(null); // search setTimeout 로직
  const [isMaster, setIsMaster] = useState(false); // group일 경우 그룹장인지 판단위해
  const maxCnt = useAppSelector(roomMaxCnt); // matching 에 전달할 최대인원수 - modal 전달
  const joinCnt = useAppSelector(roomJoinCnt); // ); //현재 matching된 인원 수 - modal 전달
  const location = useAppSelector(roomLocation);
  const lat = useAppSelector(roomLat);
  const lon = useAppSelector(roomLon);

  /**
   * 친구 목록 가져오기
   */
  useEffect(() => {
    setFriendList([
      {
        nick_name: 'lee',
        profile_img:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE',
        email: 'skatn@naver.com',
      },
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

  //소켓 연동 - 페이지 들어올 떄 한번만
  useEffect(() => {
    const io = require('socket.io-client');
    socket = io('http://localhost:4000/search', {
      withCredentials: true,
    });
    socket.on('reject_match', (res: any) => {
      if (res.message === 'invalid access') {
        console.log(res);
      }
      if (res.message === 'another client request') {
        // 매칭 중 다른 탭 또는 다른 클라이언트에서 본인 아이디로 매칭을 한 경우 - 메인화면으로 이동 or 로그아웃
        socket.emit('enter', { email });
        navigate('/');
      }
      if (res.message === 'aleady attended room') {
        let { room_id } = res;
        // 이미 어떤 방에 참가한 경우 - 받아온 room_id 에 맞는 채팅방 이동
        navigate('/room', { state: { room_id } });
      }
      if (res.message === 'someone aleady attended room') {
        // 그룹 매칭 시 그룹중 한명이 이미 방에 참가한 경우 - 모달창으로 알람 발생
        console.log('그룹원중 한명이 이미 방에 참가하였습니다.');
        dispatch(showAlert('alreadyRoomFriend'));
        setIsSearching(false);
        setIsMatching(false);
        return;
      }
      if (res.message === 'some group member aleady searching') {
        // 그룹 매칭 시 그룹중 한명이 이미 매칭 검색중인 경우 - 모달창으로 알람 발생 후 페이지 reload
        console.log('그룹원중 한명이 이미 매칭을 진행중 입니다.');
        dispatch(showAlert('alreadySearchingFriend'));
        setIsSearching(false);
        setIsMatching(false);
        return;
      }
      if (res.message === 'out of range user number') {
        // 그룹 매칭 시 카테고리 허용 인원 수 <= 그룹인원의 수  인 경우 - 모달창으로 알람 발생
        console.log('매칭인원이 카테고리의 인원보다 많거나 같습니다.');
        dispatch(showAlert('outOfRange'));
        setIsSearching(false);
        setIsMatching(false);
        return;
      }
      if (res.message === 'not group master') {
        //dispatch(showAlert('그룹장이 아니어서 매칭취소를 할 수 없습니다.'));
        console.log('그룹장이 아니어서 매칭취소를 할 수 없습니다');
        dispatch(showAlert('cannotCancel'));
        return;
      }
    });

    //
    socket.on('search_room', async (res: any) => {
      if (res.type === 'GROUP' && res.is_master) setIsMaster(true);

      setIsSearching(true);
      //if (search !== null) clearTimeout(search);
      console.log('now searching');
      res.count++;
      let timeout: any = setTimeout(() => {
        socket.emit('search_room', res);
      }, 5000);
      setSearch(timeout);
    });

    //임시 룸 waiting
    socket.on('waiting', async (data: any) => {
      if (data.is_insert) {
        data.email = email;
        socket.emit('enter', data);

        // 임시 대기룸 인원 다 찼을경우 - room_id 에 맞는 채팅룸 이동
        let room_id = data.room_id;
        navigate('/room', { state: { room_id } });
      } else {
        setIsSearching(false);
        setIsMatching(true);
        dispatch(setJoinCnt(data.participants.length));
        console.log('now enter: ' + data.participants.length);
      }
    });

    //매칭 취소
    socket.on('cancel', async (res: any) => {
      if (!res.is_master) {
        await socket.emit('enter', { email, uuid: res.uuid, is_insert: true });
      }
      setIsMatching(false); // 모달 창을 닫음
      setIsSearching(false);
      dispatch(setJoinCnt(0));
      console.log('matching cancel');
      socket.emit('searching_check', { email });
    });

    //매칭 성공
    socket.on('enter', (res: any) => {
      socket.emit('enter', res);
      console.log('matched !! \n todo:indexPage or chat room redirection');

      // db에서 원하는 조건의 방을 찾았을 경우 - room_id 에 맞는 채팅룸 이동
      let room_id = res.room_id;
      navigate('/room', { state: { room_id } });
    });

    //친구정보를 전달하고 현재 matching 진행중인 유저를 받아옴
    socket.on('searching_friend', (res: any) => {
      //검색중인 친구 목록
      let { leave_friends } = res;
      setVisibleFriend([...leave_friends]);
    });
    // 필터링
    socket.on('searching_check', (res: any) => {
      if (res.message !== 'ok') {
        dispatch(setMaxCnt(res.maxNum));
      }
      if (res.message === 'search') setIsSearching(true);
      if (res.message === 'ok') {
      }
    });
    socket.on('waiting_group', (res: any) => {
      socket.emit('waiting_group', res);
    });
    //친구정보를 전달하고 현재 matching 진행중인 유저를 체크
    socket.emit('searching_check', { email });
  }, []);

  //같이 할 수 있는 친구목록 체크
  useEffect(() => {
    if (socket !== null) {
      socket.emit('searching_friend', {
        email_list: [...friendList],
      });
    }
  }, [socket]);
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
      dispatch(setMaxCnt(selected.user_num));
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

    // 원하는 모임 조건 선택(조건은 임시)
    if (category_id !== -1) {
      // 모임 찾기
      setIsSearching(true);

      //소켓 통신 이용해 searching 시작
      socket.emit('find_room', searchData);
    } else {
      setMessage('카테고리를 선택해주세요.');
    }
  };

  /**
   * matching을 끝냄
   */
  const handleMatching = async () => {
    const email_list: string[] = [...selectedFriend];
    const type: string = email_list.length > 0 ? 'GROUP' : 'ALONE';
    // if (type === 'GROUP' && !isMaster) {
    //   return;
    // }
    // socket cancel emit
    if (search !== null) clearTimeout(search);
    socket.emit('cancel', { email, type, email_list });
  };

  // searching 중에도 cancel 버튼 있으면 좋을듯.. - handleMatching으로 통합
  // const handleSearchCancel = () => {
  //   setIsSearching(false);
  // };
  return (
    <>
      <Header />
      <Container>
        {modalMessage.length > 0 ? <Modal>{modalMessage}</Modal> : <></>}
        {isMatching ? <MatchingModal handleMatching={handleMatching} /> : <></>}
        {isSearching ? (
          <Searching>
            <CancelBtn onClick={handleMatching}>취소</CancelBtn>
          </Searching>
        ) : (
          <></>
        )}
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
                {visibleFriend.map((friend: FriendType) => {
                  // friendList -> visibleFriend 로 변경
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
      <Alert />
    </>
  );
};

export default Search;