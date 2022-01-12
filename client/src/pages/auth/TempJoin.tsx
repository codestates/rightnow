import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import AuthContainer from '../../components/layout/AuthContainer';
import Logo from '../../components/Logo';
import userApi from '../../api/userApi';
import { useAppDispatch } from '../../config/hooks';
import { updateAccessToken } from '../../reducers/userSlice';
import { showAlert, updateUrl } from '../../reducers/componetSlice';

interface IUserInfo {
  nickname: string;
  password: string;
  rePassword: string;
}

const TempJoin = () => {
  const dispatch = useAppDispatch();
  // ref
  const passwordRef = useRef<HTMLInputElement>(null);
  const rePasswordRef = useRef<HTMLInputElement>(null);

  // 사용자의 이메일, 페스워드 state
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    nickname: '',
    password: '',
    rePassword: '',
  });

  // input 상태 관리
  const stateHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.indexOf(' ') !== -1) {
      dispatch(showAlert('blank'));
    }
    if (e.target.id === 'nickname') {
      setUserInfo({
        ...userInfo,
        nickname: e.target.value.replace(/ /g, ''),
      });
    } else if (e.target.id === 'password') {
      setUserInfo({
        ...userInfo,
        password: e.target.value.replace(/ /g, ''),
      });
    } else if (e.target.id === 're-password') {
      setUserInfo({
        ...userInfo,
        rePassword: e.target.value.replace(/ /g, ''),
      });
    }
  };

  // 비밀번호 불일치 에러 메세지, 닉네임이 겹치는 경우
  const [error, setError] = useState<string>('');

  // 버튼 활성화
  const [isDisable, setIsDisable] = useState<boolean>(true);

  // 임시 계정 만들기 버튼 활성화 관련
  useEffect((): void => {
    if (
      userInfo.nickname === '' ||
      userInfo.password === '' ||
      userInfo.rePassword === ''
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [userInfo]);

  // 엔터 단축키 관련 >>> 한글 마지막 글자가 다음 input에 써지는 에러가 있습니다.
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    if (target.id === 'nickname' && e.code === 'Enter') {
      passwordRef.current?.focus();
    } else if (target.id === 'password' && e.code === 'Enter') {
      rePasswordRef.current?.focus();
    } else if (
      target.id === 're-password' &&
      !isDisable &&
      e.code === 'Enter'
    ) {
      requestTempSignup();
    }
  };

  const requestTempSignup = (): void => {
    setError('');
    if (userInfo.password === userInfo.rePassword) {
      const body = {
        nick_name: userInfo.nickname,
        password: userInfo.password,
        type: 'TEMP',
      };
      const callback = (code: number, data: string) => {
        if (code === 201) {
          dispatch(updateUrl('tempSignup'));
          dispatch(updateAccessToken(data));
        } else if(code === 400) {
          setError('닉네임이 존재합니다.')
        }
      };
      userApi('signup', body, callback);
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <>
      <AuthContainer>
        <>
          <div className="flex justify-center items-center space-x-2">
            <Logo />
          </div>
          <p className="inline-flex mt-4 w-96 text-gray-600 text-sm">
            기본 정보
          </p>
          <div className="mt-2">
            <input
              id="nickname"
              className="border-2 w-96 border-slate-200 h-12 rounded-md pl-2 outline-main"
              type={'text'}
              value={userInfo.nickname}
              onChange={(e) => {
                stateHandler(e);
              }}
              placeholder="닉네임을 8글자 이내로 입력해주세요"
              maxLength={8}
              onKeyDown={(e) => {
                pressEnter(e);
              }}
            />
          </div>
          <div className="mt-2">
            <input
              id="password"
              className="border-2 w-96 border-slate-200 h-12 rounded-md pl-2 outline-main"
              type={'password'}
              value={userInfo.password}
              onChange={(e) => {
                stateHandler(e);
              }}
              onKeyDown={(e) => {
                pressEnter(e);
              }}
              placeholder="비밀번호를 입력해주세요"
              ref={passwordRef}
            />
          </div>
          <div className="mt-2">
            <input
              id="re-password"
              className="border-2 w-96 border-slate-200 h-12 rounded-md pl-2 outline-main"
              type={'password'}
              value={userInfo.rePassword}
              onChange={(e) => {
                stateHandler(e);
              }}
              onKeyDown={(e) => {
                pressEnter(e);
              }}
              placeholder="비밀번호를 한번 더 입력해주세요"
              ref={rePasswordRef}
            />
          </div>
          {error && (
            <p className="inline-flex text-red-400 w-96 pl-2 text-sm">
              {error}
            </p>
          )}
          <div className="mt-6">
            <button
              className={`w-96 h-12 rounded-md ${
                isDisable
                  ? 'bg-slate-100 text-slate-300'
                  : 'bg-main text-white hover:bg-orange-700'
              }`}
              disabled={isDisable}
              onClick={requestTempSignup}
            >
              임시 계정 만들기
            </button>
          </div>
          <p className="inline-flex w-96 mt-4 text-sm text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link to={'/auth/login'}>
              <span className="ml-2 text-main cursor-pointer">로그인</span>
            </Link>
          </p>
        </>
      </AuthContainer>
    </>
  );
};

export default TempJoin;
