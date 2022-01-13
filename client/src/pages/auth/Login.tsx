import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import AuthContainer from '../../components/layout/AuthContainer';
import { isValidEmail } from '../../utils/regex';
import userApi from '../../api/userApi';
import { useAppDispatch } from '../../config/hooks';
import { useNavigate } from 'react-router-dom';
import { updateAccessToken } from '../../reducers/userSlice';
import kakaoLogo from '../../images/kakao-logo.jpg';
import googleLogo from '../../images/google-logo.jpg';

interface IUserInfo {
  email: string;
  password: string;
  tempId: string;
  tempPw: string;
}

interface IIsDisable {
  login: boolean;
  tempLogin: boolean;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useNavigate();
  // ref
  const passwordRef = useRef<HTMLInputElement>(null);
  const tempPwRef = useRef<HTMLInputElement>(null);

  // 사용자의 이메일, 페스워드 state
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    email: '',
    password: '',
    tempId: '',
    tempPw: '',
  });

  const stateHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.id === 'email') {
      setUserInfo({
        ...userInfo,
        email: e.target.value,
      });
    } else if (e.target.id === 'password') {
      setUserInfo({
        ...userInfo,
        password: e.target.value,
      });
    } else if (e.target.id === 'tempId') {
      setUserInfo({
        ...userInfo,
        tempId: e.target.value,
      });
    } else if (e.target.id === 'tempPw') {
      setUserInfo({
        ...userInfo,
        tempPw: e.target.value,
      });
    }
  };
  // 로그인 버튼 활성화관련
  const [isLoginDisable, setIsLoginDisable] = useState<boolean>(true);
  const [isTempLoginDisable, setIsTempLoginDisable] = useState<boolean>(true);

  // 로그인 버튼 활성화
  useEffect((): void => {
    if (userInfo.password === '' || !isValidEmail(userInfo.email)) {
      setIsLoginDisable(true);
    } else {
      setIsLoginDisable(false);
    }
  }, [userInfo]);

  // 임시 로그인 버튼 활성화
  useEffect((): void => {
    if (userInfo.tempId === '' || userInfo.tempPw === '') {
      setIsTempLoginDisable(true);
    } else {
      setIsTempLoginDisable(false);
    }
  }, [userInfo]);

  // 이메일에서 엔터를 누를 경우 비밀번호로 이동
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    if (
      target.id === 'email' &&
      e.code === 'Enter' &&
      isValidEmail(userInfo.email)
    ) {
      passwordRef.current?.focus();
    } else if (
      target.id === 'password' &&
      !isLoginDisable &&
      e.code === 'Enter'
    ) {
      requestLogin();
    } else if (
      target.id === 'tempId' &&
      e.code === 'Enter' &&
      userInfo.tempId !== ''
    ) {
      tempPwRef.current?.focus();
    } else if (
      target.id === 'tempPw' &&
      !isTempLoginDisable &&
      e.code === 'Enter'
    ) {
      requestTempLogin();
    }
  };

  // 로그인 에러
  const [loginError, setLoginError] = useState<string>('');
  const [tempLoginError, setTempLoginError] = useState<string>('');

  // 로그인 요청
  const requestLogin = (): void => {
    setLoginError('');
    const body = {
      email: userInfo.email,
      password: userInfo.password,
    };
    const callback = (code: number, data: string) => {
      if (code === 200) {
        dispatch(updateAccessToken(data));
      } else {
        setLoginError(data);
      }
    };
    userApi('login', body, callback);
  };
  // 임시 로그인 요청
  const requestTempLogin = (): void => {
    setTempLoginError('');
    const body = {
      type: 'TEMP',
      nick_name: userInfo.tempId,
      password: userInfo.tempPw,
    };
    const callback = (code: number, data: string) => {
      if (code === 200) {
        dispatch(updateAccessToken(data));
      } else if (code === 400) {
        setTempLoginError('등록되지 않은 임시계정 입니다.');
      } else if (code === 401) {
        setTempLoginError(data);
      }
    };
    userApi('login', body, callback);
  };

  return (
    <>
      <AuthContainer>
        <>
          <div className="flex justify-center items-center">
            <Logo width={100} />
          </div>
          <div className=" flex justify-center items-start space-x-20 mt-6">
            <div>
              <div className=" relative bg-white text-center flex justify-center items-center">
                <p className=" bg-white inline absolute px-3 text-lg font-semibold">
                  로그인
                </p>
                <div className=" border-t-1 border-t-sub w-full" />
              </div>
              <div className="mt-6">
                <input
                  id="email"
                  className="border-2 border-slate-200 w-96 h-12 rounded-md pl-2 outline-main"
                  type={'email'}
                  value={userInfo.email}
                  onChange={(e) => {
                    stateHandler(e);
                  }}
                  placeholder="이메일 주소(ID)를 입력하세요"
                  onKeyDown={(e) => {
                    pressEnter(e);
                  }}
                />
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  className="border-2 border-slate-200 w-96 h-12 rounded-md pl-2 outline-main"
                  type={'password'}
                  value={userInfo.password}
                  onChange={(e) => {
                    stateHandler(e);
                  }}
                  onKeyDown={(e) => {
                    pressEnter(e);
                  }}
                  placeholder="비밀번호를 입력하세요"
                  ref={passwordRef}
                />
              </div>
              {loginError && (
                <div className="text-sm text-red-400 w-96 inline-block text-left pl-2">
                  {loginError}
                </div>
              )}
              <div className="mt-6">
                <button
                  className={`w-96 h-12 rounded-md ${
                    isLoginDisable
                      ? 'bg-slate-100 text-slate-300'
                      : 'bg-main text-gray-50 hover:bg-orange-700'
                  }`}
                  onClick={requestLogin}
                  disabled={isLoginDisable}
                >
                  로그인
                </button>
              </div>
              <Link to={'/auth/resetPassword'}>
                <p className="mt-8 text-sm text-slate-500 cursor-pointer inline-flex">
                  비밀번호를 잊으셨나요?
                </p>
              </Link>
              <div className="mt-8">
                <p className="mb-4 text-gray-600">소셜 계정으로 로그인</p>
              </div>
              <div className="relative">
                <button
                  className={
                    'w-96 h-12 rounded-md bg-kakao text-kakaoText font-semibold'
                  }
                  onClick={() => {
                    window.open(
                      `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`,
                      '_self',
                    );
                  }}
                >
                  카카오로 로그인
                </button>
                <img
                  src={kakaoLogo}
                  alt="kakao-logo"
                  width={25}
                  className=" absolute top-3 left-5"
                />
              </div>
              <div className="mt-2 relative">
                <button
                  className={
                    'w-96 h-12 rounded-md border-1 bg-white text-black font-semibold'
                  }
                  onClick={() => {
                    window.open(
                      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`,
                      '_self',
                    );
                  }}
                >
                  구글로 로그인
                </button>
                <img
                  src={googleLogo}
                  alt="google-logo"
                  width={25}
                  className="absolute top-3 left-5"
                />
              </div>
              <p className="mt-6 text-gray-600">
                아직 라잇나우 계정이 없으신가요?
              </p>
              <div className="mt-6">
                <Link to="/auth/join">
                  <button
                    className={
                      'w-96 h-12 rounded-md border-1 border-main text-main hover:bg-gray-100'
                    }
                  >
                    회원가입
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <div className=" relative bg-white text-center flex justify-center items-center">
                <p className=" bg-white inline absolute px-3 text-lg font-semibold">
                  일회용 아이디 로그인
                </p>
                <div className=" border-t-1 border-t-sub w-full" />
              </div>
              <div className=" text-left w-96 pl-6 mt-6">
                <ul className=" list-outside list-disc leading-6">
                  <li>
                    사용된 아이디와 비밀번호는 하나의 모임에서만 사용할 수
                    있습니다.
                  </li>
                  <li>모임을 나갈 경우 해당 계정은 삭제됩니다.</li>
                  <li>
                    이전에 나가기를 하지 않은 일회용 아이디가 있다면 모임이
                    닫히기 전까지는 해당 일회용 계정을 사용할 수 있습니다.
                  </li>
                  <li>모임은 모든 참여자가 나갈 경우 자동으로 닫힙니다.</li>
                </ul>
              </div>
              <div className="mt-6">
                <input
                  id="tempId"
                  className="border-2 border-slate-200 w-96 h-12 rounded-md pl-2 outline-main"
                  type={'text'}
                  value={userInfo.tempId}
                  onChange={(e) => {
                    stateHandler(e);
                  }}
                  placeholder="임시 아이디를 입력하세요"
                  onKeyDown={(e) => {
                    pressEnter(e);
                  }}
                />
              </div>
              <div className="mt-2">
                <input
                  id="tempPw"
                  className="border-2 border-slate-200 w-96 h-12 rounded-md pl-2 outline-main"
                  type={'password'}
                  value={userInfo.tempPw}
                  onChange={(e) => {
                    stateHandler(e);
                  }}
                  onKeyDown={(e) => {
                    pressEnter(e);
                  }}
                  placeholder="임시 비밀번호를 입력하세요"
                  ref={tempPwRef}
                />
              </div>
              {tempLoginError && (
                <div className="text-sm text-red-400 w-96 inline-block text-left pl-2">
                  {tempLoginError}
                </div>
              )}
              <div className="mt-6">
                <button
                  className={`w-96 h-12 rounded-md ${
                    isTempLoginDisable
                      ? 'bg-slate-100 text-slate-300'
                      : 'bg-main text-gray-50 hover:bg-orange-700'
                  }`}
                  onClick={requestTempLogin}
                  disabled={isTempLoginDisable}
                >
                  임시 로그인
                </button>
              </div>
              <p className="mt-6 text-gray-600">임시 계정이 없으신가요?</p>
              <div className="mt-6">
                <Link to="/auth/tempJoin">
                  <button
                    className={
                      'w-96 h-12 rounded-md border-1 border-main text-main hover:bg-gray-100'
                    }
                  >
                    임시 계정 만들기
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      </AuthContainer>
    </>
  );
};

export default Login;
