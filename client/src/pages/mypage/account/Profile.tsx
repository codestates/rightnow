import React, { ChangeEvent, useEffect, useState, KeyboardEvent, useRef } from 'react';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { useAppSelector, useAppDispatch } from '../../../config/hooks';
import {
  updateNickname,
  updateProfile,
  userAccessToken,
  userEmail,
  userNickname,
  userProfile,
} from '../../../reducers/userSlice';
import defaultProfile from '../../../images/profile.png';
import axios from 'axios';
import { IconButton } from '@material-ui/core';
import userApi from '../../../api/userApi';
import { showAlert } from '../../../reducers/componetSlice';

const Proflie = () => {
  const imageEndpoint = process.env.REACT_APP_IMAGE_ENDPOINT;

  const dispatch = useAppDispatch();

  //ref
  const inputRef = useRef<HTMLInputElement>(null)

  // 유저 프로파일 이미지
  const profile = useAppSelector(userProfile);
  // 드롭다운 보임 유무
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
  const [showProfileImage, setShowProfileImage] = useState<boolean>(true);

  // 유저의 이메일
  const email = useAppSelector(userEmail);

  // 유저의 accessToken
  const accessToken = useAppSelector(userAccessToken);

  // 회원정보 관련
  const curNickname = useAppSelector(userNickname);
  const [nickname, setNickname] = useState<string>(curNickname);

  // 회원정보 수정
  const changeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.indexOf(' ') !== -1) {
      dispatch(showAlert('blank'));
    }
    setNickname(e.target.value.replace(/ /g, ''));
  };

  // 저장버튼 활성화 유무
  const [isDisable, setIsDisable] = useState<boolean>(true);

  useEffect(() => {
    if (nickname === '' || nickname === curNickname) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [nickname]);

  // 사진 업로드
  const onChangeImg = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
      const uploadFile = e.target.files[0];
      const formData = new FormData();
      formData.append('file', uploadFile);

      axios
        .put(
          `${process.env.REACT_APP_ENDPOINT}/user/upload/image/${email}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then((res) => {
          console.log(res)
          dispatch(updateProfile(res.data.data.profile_image));
          dispatch(showAlert('updateProfile'));
          document.getElementById('profile-upload')?.blur();
        })
        .catch((err) => {
          console.log(err.response)
          console.log(err)
          if (err.response.status === 400) {
            window.location.reload();
            dispatch(showAlert('profileTypeError'));
          }
        });
    }
  };

  // 회원정보 수정요청
  const requestModifyUserInfo = (): void => {
    const body = {
      nick_name: nickname,
    };
    const callback = (code: number, data: string) => {
      if (code === 200) {
        dispatch(updateNickname(data));
        dispatch(showAlert('updateUserInfo'));
        setIsDisable(true);
      } else {
        console.log(data);
      }
    };
    userApi('updateUserInfo', body, callback, accessToken);
  };

  // 이메일에서 엔터를 누를 경우 비밀번호로 이동
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === 'Enter' && !isDisable) {
      requestModifyUserInfo();
    }
  };

  return (
    <>
      <p className="text-lg font-semibold">프로필 설정</p>
      <div className="mt-2">
        <div
          className={`flex items-center p-4 w-96 justify-between border-2 border-slate-300 ${
            showUserInfo ? 'rounded-t-md' : 'rounded-md'
          }`}
        >
          <div className="font-semibold">회원정보 수정</div>
          {showUserInfo ? (
            <IconButton
              size={'small'}
              onClick={() => {
                setShowUserInfo(false);
              }}
            >
              <KeyboardArrowUp
                id="userInfo"
                className={`text-gray-500 hover:text-black`}
              />
            </IconButton>
          ) : (
            <IconButton
              size={'small'}
              onClick={() => {
                setShowUserInfo(true);
              }}
            >
              <KeyboardArrowDown
                id="userInfo"
                className={`text-gray-500 hover:text-black`}
              />
            </IconButton>
          )}
        </div>
        <div
          className={`w-96 overflow-hidden border-2 -mt-0.5 border-slate-300 border-t-0 rounded-b-md text-center transition-all space-y-5 ${
            showUserInfo ? 'p-4 h-60 opacity-100' : 'p-0 h-0 opacity-0 border-0'
          }`}
        >
          <div className="space-y-1">
            <p className="text-gray-600 text-sm text-left font-semibold">
              이메일
            </p>
            <p className="text-gray-600 text-sm text-left">{email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600 text-sm text-left font-semibold">
              닉네임
            </p>
            <input
              id="nickname"
              className="border-2 border-slate-200 block w-full h-10 rounded-md pl-2 outline-main text-sm"
              type={'text'}
              placeholder="변경할 닉네임을 8글자 이내로 입력해주세요"
              maxLength={8}
              value={nickname}
              onChange={(e) => {
                changeNickname(e);
              }}
              onKeyDown={(e) => {
                pressEnter(e);
              }}
            />
          </div>
          <div className="text-right relative top-4">
            <button
              className={`w-36 h-10 rounded-md   text-sm font-semibold ${
                isDisable
                  ? 'bg-slate-100 text-slate-300 border-0'
                  : 'border-slate-500 text-slate-500 border-2 hover:bg-gray-100'
              }`}
              disabled={isDisable}
              onClick={requestModifyUserInfo}
            >
              저장
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div
          className={`flex items-center p-4 w-96 justify-between border-2 border-slate-300 ${
            showProfileImage ? 'rounded-t-md' : 'rounded-md'
          }`}
        >
          <div className="font-semibold">프로필 사진</div>
          {showProfileImage ? (
            <IconButton
              size={'small'}
              onClick={() => {
                setShowProfileImage(false);
              }}
            >
              <KeyboardArrowUp
                id="image"
                className={`text-gray-500 hover:text-black`}
              />
            </IconButton>
          ) : (
            <IconButton
              size={'small'}
              onClick={() => {
                setShowProfileImage(true);
              }}
            >
              <KeyboardArrowDown
                id="image"
                className={`text-gray-500 hover:text-black`}
              />
            </IconButton>
          )}
        </div>
        <div
          className={`w-96 overflow-hidden border-2 -mt-0.5 border-slate-300 border-t-0 rounded-b-md text-center transition-all ${
            showProfileImage
              ? 'p-4 h-80 opacity-100'
              : 'p-0 h-0 opacity-0 border-0'
          }`}
        >
          <div
            className="inline-block w-56 h-56 rounded-full border-2 border-slate-300 overflow-hidden bg-red-200"
            style={{
              backgroundImage: `url(${
                profile === null
                  ? defaultProfile
                  : profile.indexOf('kakaocdn') !== -1 ||
                    profile.indexOf('googleusercontent') !== -1
                  ? profile
                  : imageEndpoint + profile
              })`,
              backgroundSize: 'cover',
            }}
          />
          <form className="text-right mt-5 cursor-pointer">
            <button
              className={`w-36 h-10 rounded-md border-2 border-slate-500 text-slate-500 text-sm font-semibold relative hover:bg-gray-100`}
            >
              사진 업로드
              <label htmlFor="profile-upload" />
              <input
                ref={inputRef}
                className="w-36 h-10 overflow-hidden absolute top-0 left-0 z-20 opacity-0"
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={onChangeImg}
              />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Proflie;
