import React, { ChangeEvent, useEffect, useState } from 'react';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { useAppSelector, useAppDispatch } from '../../../config/hooks';
import { updateNickname, userAccessToken, userEmail, userNickname } from '../../../reducers/userSlice';
import profile from '../../../images/profile.png';
import axios from 'axios';
import { IconButton } from '@material-ui/core';
import userApi from '../../../api/userApi';
import { showAlert } from '../../../reducers/componetSlice';
import Alert from '../../../components/Alert';

interface IShowDropDown {
  userInfo: boolean;
  image: boolean;
}

const Proflie = () => {
  const dispatch = useAppDispatch();
  // 드롭다운 보임 유무
  const [showDropDown, setShowDropDown] = useState<IShowDropDown>({
    userInfo: true,
    image: false,
  });

  // 유저의 이메일
  const email = useAppSelector(userEmail);

  // 유저의 accessToken
  const accessToken = useAppSelector(userAccessToken);

  const toggleDropDown = (e: any): void => {
    if (e.target.id === 'userInfo') {
      setShowDropDown({
        ...showDropDown,
        userInfo: !showDropDown.userInfo,
      });
    } else if (e.target.id === 'image') {
      setShowDropDown({
        ...showDropDown,
        image: !showDropDown.image,
      });
    }
  };

  // 회원정보 관련
  const [nickname, setNickname] = useState<string>(
    useAppSelector(userNickname),
  );

  // 회원정보 수정
  const changeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // 저장버튼 활성화 유무
  const [isDisable, setIsDisable] = useState<boolean>(false);

  useEffect(() => {
    if (nickname === '') {
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
      formData.append('files', uploadFile);

      await axios({
        method: 'put',
        url: '/api/files/images',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  };

  // 회원정보 수정요청
  const requestModifyUserInfo = (): void => {
    const body = {
      email: email,
      nick_name: nickname,
    }
    const callback = (code: number, data: string) => {
      if (code === 200) {
        dispatch(updateNickname(data))
        dispatch(showAlert('updateUserInfo'))
      } else {
        console.log(data)
      }
    }
    userApi('updateUserInfo', body, callback, accessToken)
  };

  return (
    <>
      <p className="text-lg font-semibold">프로필 설정</p>
      <div className="mt-5">
        <div
          className={`flex items-center p-4 w-96 justify-between border-2 border-slate-300 ${
            showDropDown.userInfo ? 'rounded-t-md' : 'rounded-md'
          }`}
        >
          <div className="font-semibold">회원정보 수정</div>
          {showDropDown.userInfo ? (
            <IconButton
              size={'small'}
              onClick={(e) => {
                toggleDropDown(e);
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
              onClick={(e) => {
                toggleDropDown(e);
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
            showDropDown.userInfo
              ? 'p-4 h-60 opacity-100'
              : 'p-0 h-0 opacity-0 border-0'
          }`}
        >
          <div className="space-y-1">
            <p className="text-gray-600 text-sm text-left font-semibold">
              이메일
            </p>
            <p className="text-gray-600 text-sm text-left">
              {email}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600 text-sm text-left font-semibold">
              닉네임
            </p>
            <input
              id="nickname"
              className="border-2 border-slate-200 block w-full h-10 rounded-md pl-2 outline-main text-sm"
              type={'text'}
              placeholder="변경할 닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => {
                changeNickname(e);
              }}
            />
          </div>
          <div className="text-right relative top-4">
            <button
              className={`w-36 h-10 rounded-md   text-sm font-semibold ${
                isDisable
                  ? 'bg-slate-100 text-slate-300 border-0'
                  : 'border-slate-500 text-slate-500 border-2'
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
            showDropDown.image ? 'rounded-t-md' : 'rounded-md'
          }`}
        >
          <div className="font-semibold">프로필 사진</div>
          {showDropDown.image ? (
            <IconButton
              size={'small'}
              onClick={(e) => {
                toggleDropDown(e);
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
              onClick={(e) => {
                toggleDropDown(e);
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
            showDropDown.image
              ? 'p-4 h-80 opacity-100'
              : 'p-0 h-0 opacity-0 border-0'
          }`}
        >
          <div className="inline-block w-56 h-56 rounded-full border-2 border-slate-300 overflow-hidden">
            <img
              src={profile}
              alt="userProfile"
              width={224}
              height={224}
              className="rounded-full"
            />
          </div>
          <form className="text-right mt-5">
            <button
              className={`w-36 h-10 rounded-md border-2 border-slate-500 text-slate-500 text-sm font-semibold relative`}
            >
              사진 업로드
              <label htmlFor="profile-upload" />
              <input
                className="bg-red-200 w-36 h-10 overflow-hidden absolute top-0 left-0 z-10 opacity-0"
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={onChangeImg}
              />
            </button>
          </form>
        </div>
      </div>
      <Alert/>
    </>
  );
};

export default Proflie;
