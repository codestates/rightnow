import React, { useEffect, useState } from 'react';
import { alert, showAlert } from '../reducers/componetSlice';
import { useAppDispatch, useAppSelector } from '../config/hooks';

const Alert = () => {
  const dispatch = useAppDispatch();
  // 알림 창의 타입지정
  const alertType: string = useAppSelector(alert);
  // 제목
  const [title, setTitle] = useState<string>('');
  // 부제목
  const [subTitle, setSubTitle] = useState<string>('');

  useEffect(() => {
    switch (alertType) {
      case 'login':
        setTitle('로그인');
        setSubTitle('로그인 하였습니다');
        break;
      case 'signup':
        setTitle('회원가입');
        setSubTitle('회원가입에 성공 하셨습니다.');
        break;
      case 'logout':
        setTitle('로그아웃');
        setSubTitle('로그아웃 하였습니다.');
        break;
      case 'updatePasswordForget':
        setTitle('비밀번호 재설정');
        setSubTitle('비밀번호를 재설정 하였습니다.');
        break;
      case 'updateUserInfo':
        setTitle('프로필 설정');
        setSubTitle('회원정보를 수정 하였습니다.');
        break;
      case 'updatePasswordKnow':
        setTitle('비밀번호 변경');
        setSubTitle('비밀번호를 변경 하였습니다.');
        break;
      case 'updatePasswordWrongPassword':
        setTitle('비밀번호 변경');
        setSubTitle('현재 비밀번호가 일치하지 않습니다.');
        break;
      case 'signout':
        setTitle('계정삭제');
        setSubTitle('라잇나우 계정을 삭제하였습니다.');
        break;
      case 'signoutWrongPassword':
        setTitle('계정삭제');
        setSubTitle('현재 비밀번호가 일치하지 않습니다.');
        break;
    }
  }, [alertType]);

  const closeAlert = (): void => {
    dispatch(showAlert(''));
  };
  return (
    <>
      <div
        className={`w-full absolute top-0 left-0 white bg-opacity-100 flex justify-center items-start ${
          alertType ? 'z-20 opacity-100 h-full' : '-z-10 opacity-0 h-0'
        }`}
        onClick={closeAlert}
      >
        <div
          className={`w-96 h-32 rounded-md bg-white p-6 relative border-1 shadow-md transition-all ${
            alertType ? 'top-10 opacity-100' : 'top-0 opacity-0'
          }`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="text-lg font-bold">{title}</div>
          <div className="text-sm mt-4">{subTitle}</div>
          <div className="mt-8 text-right space-x-2 absolute bottom-6 right-6">
            <button
              className={`w-20 h-8 rounded-md bg-main text-white text-sm`}
              onClick={closeAlert}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;
