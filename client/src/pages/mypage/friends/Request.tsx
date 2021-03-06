import React, { useEffect, useState } from 'react';
import defaultProfile from '../../../images/profile.png';
import friendsApi from '../../../api/friendsApi';
import { useAppDispatch, useAppSelector } from '../../../config/hooks';
import {
  updateRequestFriendCount,
  updateRequestFriendList,
  userEmail,
} from '../../../reducers/userSlice';
import { showAlert } from '../../../reducers/componetSlice';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IUserInfo {
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

const Request = () => {
  const imageEndpoint = process.env.REACT_APP_IMAGE_ENDPOINT;
  const dispatch = useAppDispatch();
  // 로딩 중 유무
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 로그인 중인 유저의 이메일
  const email = useAppSelector(userEmail);
  // 친구요청을 보낸 사람들 목록
  const [requestUserList, setRequestUserList] = useState<IUserInfo[]>([]);

  // 친구요청 목록 불러오기
  const requestRepuestList = () => {
    const callback = (code: number, data: IData[]): void => {
      if (code === 200) {
        const newData = data.map((obj, idx) => {
          const { email, nick_name, profile_image } = obj;
          return {
            email,
            nick_name,
            profile_image,
          };
        });
        const friendList = data.map((obj, idx) => {
          const { email } = obj;
          return email;
        });
        setRequestUserList(newData);
        dispatch(updateRequestFriendList(friendList));
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    friendsApi('getFriendRequestList', {}, callback, email);
  };

  // 페이지 랜더링 시 친구요청 목록 불러오기
  useEffect((): void => {
    requestRepuestList();
    dispatch(updateRequestFriendCount(0));
  }, []);

  // 수락 or 거절 응답
  const requestResponse = (reqUser: string, answer: string): void => {
    const body = {
      req_user: reqUser,
      res_user: email,
      answer: answer,
    };
    const callback = (code: number, data: string): void => {
      // 수락 or 거절 이후 리스트 초기화
      requestRepuestList();
      dispatch(showAlert(data));
    };
    friendsApi('resFriend', body, callback);
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
            {requestUserList.length === 0
              ? '친구 요청이 없습니다.'
              : `친구 요청(${requestUserList.length})`}
          </div>
          <div className="w-135 mt-2">
            {requestUserList.map((obj) => {
              const { email, nick_name, profile_image } = obj;
              return (
                <div
                  className="flex relative items-center border-b-1 py-2"
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
                  <div className="ml-5 font-semibold text-sub">{nick_name}</div>
                  <div className="absolute right-0 flex items-center space-x-1">
                    <div
                      className=" bg-main py-1.5 px-4 text-sm text-white rounded-md text-center hover:bg-orange-700 cursor-pointer"
                      onClick={() => {
                        requestResponse(email, 'accept');
                      }}
                    >
                      수락
                    </div>
                    <div
                      className=" border-1 border-main py-1.5 px-4 text-sm text-main rounded-md text-center hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        requestResponse(email, 'reject');
                      }}
                    >
                      거절
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

export default Request;
