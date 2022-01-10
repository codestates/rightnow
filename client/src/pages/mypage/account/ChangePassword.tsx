import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { useAppSelector, useAppDispatch } from '../../../config/hooks';
import { userEmail } from '../../../reducers/userSlice';
import userApi from '../../../api/userApi';
import { showAlert } from '../../../reducers/componetSlice';

interface IPassword {
  password: string;
  newPassword: string;
  reNewPassword: string;
}

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  // 유저의 이메일
  const email = useAppSelector(userEmail);

  // ref
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const reNewPasswordRef = useRef<HTMLInputElement>(null);

  // 새 비밀번호, 비밀번호 확인
  const [passwordInfo, setPasswordInfo] = useState<IPassword>({
    password: '',
    newPassword: '',
    reNewPassword: '',
  });

  // usestate 변경 관련
  const stateHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.id === 'password') {
      setPasswordInfo({
        ...passwordInfo,
        password: e.target.value,
      });
    } else if (e.target.id === 'newPassword') {
      setPasswordInfo({
        ...passwordInfo,
        newPassword: e.target.value,
      });
    } else if (e.target.id === 'reNewPassword') {
      setPasswordInfo({
        ...passwordInfo,
        reNewPassword: e.target.value,
      });
    }
  };

  // 비밀번호가 같지 않을 경우 오류 메세지
  const [matchError, setMatchError] = useState<string>('');

  // 저장 버튼 활성화 관련
  const [isDisable, setIsDisable] = useState<boolean>(true);

  useEffect((): void => {
    if (
      passwordInfo.password === '' ||
      passwordInfo.newPassword === '' ||
      passwordInfo.reNewPassword === ''
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [passwordInfo]);

  // 엔터 단축키 관련
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    if (target.id === 'password' && e.code === 'Enter') {
      newPasswordRef.current?.focus();
    } else if (target.id === 'newPassword' && e.code === 'Enter') {
      reNewPasswordRef.current?.focus();
    } else if (
      target.id === 'reNewPassword' &&
      e.code === 'Enter' &&
      !isDisable
    ) {
      reNewPasswordRef.current?.blur();
      requestUpdatePassword();
    }
  };

  // 비밀번호 수정 요청
  const requestUpdatePassword = (): void => {
    if (passwordInfo.newPassword === passwordInfo.reNewPassword) {
      setMatchError('');
      const body = {
        email: email,
        password: passwordInfo.password,
        new_password: passwordInfo.newPassword,
        type: 'know',
      };
      const callback = (code: number) => {
        if (code === 200) {
          setPasswordInfo({
            password: '',
            newPassword: '',
            reNewPassword: '',
          });
          dispatch(showAlert('updatePasswordKnow'));
        } else if (code === 401) {
          dispatch(showAlert('updatePasswordWrongPassword'));
        }
      };
      userApi('updatePasswordKnow', body, callback);
    } else {
      setMatchError('새 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <>
      <div className="text-lg font-semibold">비밀번호 변경</div>
      <div className="mt-8 pl-4 space-y-6 relative">
        <div className="flex items-center space-x-12 text-sm">
          <span>현재 비밀번호</span>
          <input
            id="password"
            className="border-2 border-slate-200 w-80 h-10 rounded-md pl-2 outline-main left-0.5 relative"
            type={'password'}
            value={passwordInfo.password}
            onChange={(e) => {
              stateHandler(e);
            }}
            placeholder="현재 비밀번호를 입력해주세요"
            onKeyDown={(e) => {
              pressEnter(e);
            }}
          />
        </div>
        <div className="flex items-center space-x-16 text-sm">
          <span>새 비밀번호</span>
          <input
            id="newPassword"
            className="border-2 border-slate-200 w-80 h-10 rounded-md pl-2 outline-main"
            type={'password'}
            value={passwordInfo.newPassword}
            onChange={(e) => {
              stateHandler(e);
            }}
            placeholder="새 비밀번호를 입력해주세요"
            onKeyDown={(e) => {
              pressEnter(e);
            }}
            ref={newPasswordRef}
          />
        </div>
        <div className="flex items-center space-x-8 text-sm">
          <span>새 비밀번호 확인</span>
          <input
            id="reNewPassword"
            className="border-2 border-slate-200 w-80 h-10 rounded-md pl-2 outline-main"
            type={'password'}
            value={passwordInfo.reNewPassword}
            onChange={(e) => {
              stateHandler(e);
            }}
            placeholder="새 비밀번호를 다시 입력해주세요"
            onKeyDown={(e) => {
              pressEnter(e);
            }}
            ref={reNewPasswordRef}
          />
        </div>
        <div className="text-sm text-red-400 absolute top-36 left-40">
          {matchError}
        </div>
      </div>

      <div className="text-right mt-20">
        <button
          className={`w-36 h-10 rounded-md ${
            isDisable ? 'bg-slate-100 text-slate-300' : 'bg-main text-white hover:bg-pink-700'
          }`}
          disabled={isDisable}
          onClick={requestUpdatePassword}
        >
          저장
        </button>
      </div>
    </>
  );
};

export default ChangePassword;
