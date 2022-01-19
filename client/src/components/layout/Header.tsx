import React, { useState } from 'react';
import Logo from '../Logo';
import Modal from '../Modal';
import { useAppSelector, useAppDispatch } from '../../config/hooks';
import {
  userIsLogin,
  userNickname,
  userProfile,
  userRole,
} from '../../reducers/userSlice';
import { Link } from 'react-router-dom';
import {
  mypageMenu,
  showModal,
  showMypage,
} from '../../reducers/componetSlice';
import defaultProfile from '../../images/profile.png';

interface IOption {
  id: string;
  label: string;
  to: string;
}

const Header = () => {
  const dispatch = useAppDispatch();
  // 프로필 이미지 서버 엔드포인트
  const imageEndpoint = process.env.REACT_APP_IMAGE_ENDPOINT;
  // 유저 role
  const role = useAppSelector(userRole);
  // mypage menu 보임 유무
  const isVisibleMypageMenu = useAppSelector(mypageMenu);
  // mypage 옵션
  const mypageOption: IOption[] =
    role === 'ADMIN'
      ? [
          { id: 'friends', label: '친구관리', to: '/mypage/friends/list' },
          { id: 'account', label: '계정관리', to: '/mypage/account/profile' },
          { id: 'user', label: '유저관리', to: '/mypage/user/list' },
          { id: 'report', label: '신고관리', to: '/mypage/report/user' },
          { id: 'category', label: '카테고리', to: '/mypage/category/list' },
        ]
      : [
          { id: 'friends', label: '친구관리', to: '/mypage/friends/list' },
          { id: 'account', label: '계정관리', to: '/mypage/account/profile' },
        ];
  // 유저의 사진
  const profile = useAppSelector(userProfile);
  // 로그인 유무
  const isLogin = useAppSelector(userIsLogin);
  // 닉네임
  const nickname = useAppSelector(userNickname);

  // 로그아웃 클릭시 모달 활성화
  const buttonHandler = (): void => {
    dispatch(showModal('logout'));
    dispatch(showMypage(false));
  };

  return (
    <>
      <header className="bg-gray-50 h-16 flex shadow-md justify-center space-x-96 fixed w-full z-40 top-0">
        <Link to={isLogin ? '/search' : '/'} className="flex items-center">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Logo />
            <p className=" text-sub font-bold text-4xl whitespace-nowrap w-auto ">
              Rightnow
            </p>
          </div>
        </Link>
        <div className="flex items-center relative w-72 justify-end pr-8 z-30">
          {!isLogin && (
            <Link to="/auth/login" className="flex items-center">
              <button
                className="rounded-lg whitespace-nowrap bg-main group relative"
                style={{ width: 86, height: 43 }}
              >
                <div
                  className="h-full rounded-lg bg-gray-50 w-4 opacity-0 relative -left-1 group-hover:w-24 group-hover:opacity-100"
                  style={{ transition: '0.3s' }}
                />
                <span className=" absolute top-3 left-4.5 font-semibold text-gray-50 transition-all group-hover:text-main">
                  Sign in
                </span>
              </button>
            </Link>
          )}
          {isLogin && (
            <div className=" text-slate-600 font-semibold text-sm mr-2 whitespace-nowrap text-ellipsis">
              {role === 'ADMIN'
                ? `${nickname}(관리자)님 환영합니다`
                : `${nickname}님 환영합니다`}
            </div>
          )}
          {isLogin && (
            <div
              className={`h-11.5 w-11.5 rounded-full flex justify-center items-center  cursor-pointer hover:bg-slate-200 ${
                isVisibleMypageMenu ? 'bg-slate-200' : 'bg-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(showMypage(!isVisibleMypageMenu));
              }}
            >
              <div
                className={'h-10 w-10 rounded-full'}
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
            </div>
          )}
          {isVisibleMypageMenu && (
            <div
              className=" bg-white absolute right-8 top-14.5 w-32 py-2 border-1 rounded-md text-xs text-slate-500 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {mypageOption.map((option, idx) => {
                const { id, label, to } = option;
                return (
                  <Link
                    to={to}
                    key={id}
                    onClick={() => {
                      dispatch(showMypage(false));
                    }}
                  >
                    <p className="hover:bg-gray-100 cursor-pointer px-2 py-2">
                      {label}
                    </p>
                  </Link>
                );
              })}
              <div className="flex justify-center mt-2 mb-1">
                <div className=" inline-flex w-28 h-1 border-t-1" />
              </div>
              <p
                className="hover:bg-gray-100 cursor-pointer px-2 py-2 text-red-400"
                onClick={buttonHandler}
              >
                로그아웃
              </p>
            </div>
          )}
        </div>
      </header>
      <Modal />
    </>
  );
};

export default Header;
