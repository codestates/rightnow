import React, { useState } from 'react';
import Logo from '../Logo';
import Modal from '../Modal';
import { useAppSelector, useAppDispatch } from '../../config/hooks';
import { userIsLogin, userNickname, logout } from '../../reducers/userSlice';
import { Link } from 'react-router-dom';
import { showModal } from '../../reducers/componetSlice';
import profile from '../../images/profile.png';

const Header = () => {
  const dispatch = useAppDispatch();
  // 로그인 유무
  const isLogin = useAppSelector(userIsLogin);
  // 닉네임
  const nickname = useAppSelector(userNickname);
  // 유저아이콘 클릭 시 모달의 보임 유무 state 관리
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleModal = (): void => {
    setIsVisible((prev) => !prev);
  };

  // 로그아웃 클릭시 모달 활성화
  const buttonHandler = (): void => {
    // toggleModal();
    dispatch(showModal('logout'));
  };

  return (
    <>
      <header
        className="bg-gray-50 h-16 flex shadow-md justify-center space-x-96 fixed w-full z-20"
        onClick={() => {
          if (isVisible) {
            toggleModal();
          }
        }}
      >
        <Link to={isLogin ? '/room' : '/'} className="flex items-center">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Logo />
            <p className=" text-sub font-bold text-4xl whitespace-nowrap w-auto ">
              rightnow
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
            <div className=" text-slate-600 font-semibold text-sm mr-2">{`${nickname}님 환영합니다`}</div>
          )}
          {isLogin && (
            <div
              className={`h-11.5 w-11.5 rounded-full flex justify-center items-center  cursor-pointer hover:bg-slate-200 ${
                isVisible ? 'bg-slate-200' : 'bg-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleModal();
              }}
            >
              <img
                src={profile}
                alt="user profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          )}
          {isVisible && (
            <div className=" bg-white absolute right-8 top-14.5 w-32 py-2 border-1 rounded-md text-xs text-slate-500 shadow-md">
              <Link to={'/mypage/friends/list'}>
                <p className="hover:bg-gray-100 cursor-pointer px-2 py-2 font">
                  친구관리
                </p>
              </Link>
              <Link to={'/mypage/account/profile'}>
                <p className="hover:bg-gray-100 cursor-pointer px-2 py-2">
                  계정관리
                </p>
              </Link>
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
      {isVisible && (
        <div
          className="bg-transparent fixed top-0 left-0 w-screen h-screen z-10"
          onClick={toggleModal}
        ></div>
      )}
      <Modal />
    </>
  );
};

export default Header;
