import React, { useState, useEffect } from 'react';
import defaultProfile from '../../../images/profile.png';
import { useAppDispatch, useAppSelector } from '../../../config/hooks';
import { userEmail } from '../../../reducers/userSlice';
import friendsApi from '../../../api/friendsApi';
import { showAlert } from '../../../reducers/componetSlice';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IFriendInfo {
  email: string;
  nick_name: string;
  profile_image: string;
}

interface IData {
  email: string;
  nick_name: string;
  profile_image: string;
  role: string;
  social_login: string;
  auth_code: string;
  is_block: string;
  block_date: string;
  createdAt: string;
  updatedAt: string;
}
const List = () => {
  const imageEndpoint = process.env.REACT_APP_IMAGE_ENDPOINT;
  const dispatch = useAppDispatch();
  // 로딩 중 유무
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 로그인 중인 유저의 이메일
  const email = useAppSelector(userEmail);
  // 친구목록
  const [friendsList, setFriendsList] = useState<IFriendInfo[]>([]);

  // 친구목록 불러오기
  const requestFriendsList = () => {
    const callback = (code: number, data: IData[]) => {
      if (code === 200) {
        const newData = data.map((obj, idx) => {
          const { email, nick_name, profile_image } = obj;
          return {
            email,
            nick_name,
            profile_image,
          };
        });
        setFriendsList(newData);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    friendsApi('getFriendList', {}, callback, email);
  };

  // 페이지 랜더링 시 친구요청 목록 불러오기
  useEffect((): void => {
    requestFriendsList();
  }, []);

  const deleteFriend = (friendEmail: string): void => {
    const body = {
      user_email: email,
      friend_email: friendEmail,
    };
    const callback = (code: number, data: string) => {
      setTimeout(() => {
        requestFriendsList();
      }, 50);
      dispatch(showAlert(data));
    };
    friendsApi('deleteFriend', body, callback);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <>
          <div className="text-lg font-semibold">
            {friendsList.length === 0
              ? '친구가 없습니다. 친구 추가를 통해 친구를 만들어 보세요.'
              : `친구 목록(${friendsList.length})`}
          </div>
          <div className="w-135 mt-2">
            {friendsList.map((obj) => {
              const { email, nick_name, profile_image } = obj;
              return (
                <div
                  className="flex relative items-center border-b-1 py-2 group"
                  key={email}
                >
                  <div
                    className={'h-10 w-10 rounded-full'}
                    style={{
                      backgroundImage: `url(${
                        profile_image === null
                          ? defaultProfile
                          : profile_image.indexOf('kakaocdn') !== -1 ||
                            profile_image.indexOf('googleusercontent') !== -1
                          ? profile_image
                          : imageEndpoint + profile_image
                      })`,
                      backgroundSize: 'cover',
                    }}
                  />
                  <div className="ml-5 text-sub font-semibold">{nick_name}</div>
                  <div className="absolute right-0">
                    <div
                      className=" border-1 border-main py-1.5 px-4 text-sm text-main rounded-md text-center hover:bg-gray-100 cursor-pointer opacity-0 transition-all group-hover:opacity-100"
                      onClick={() => {
                        deleteFriend(email);
                      }}
                    >
                      친구 삭제
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default List;
