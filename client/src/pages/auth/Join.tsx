import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContainer from '../../components/layout/AuthContainer';
import { isNumber, isValidEmail } from '../../utils/regex';
import Logo from '../../components/Logo';
import userApi from '../../api/userApi';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { updateAccessToken } from '../../reducers/userSlice';
import { alert, showAlert, updateUrl } from '../../reducers/componetSlice';

interface IUserInfo {
  email: string;
  nickname: string;
  password: string;
  rePassword: string;
  auth: string;
}

interface IError {
  passwordError: string;
  authError: string;
  existEmailError: string;
}

interface IDisable {
  authDisable: boolean;
  singUpDisable: boolean;
  emailDisable: boolean;
}

const Join = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // ref
  const emailRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rePasswordRef = useRef<HTMLInputElement>(null);
  const authRef = useRef<HTMLInputElement>(null);

  // 알림 창 존재 유무
  const isExistAlert = useAppSelector(alert) !== '';

  // 사용자의 이메일, 페스워드 state
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    email: '',
    nickname: '',
    password: '',
    rePassword: '',
    auth: '',
  });

  // 인증번호 관련
  const [authNumber, setAuthNumber] = useState<string>('');
  const [showAuthNumber, setShowAuthNumber] = useState<boolean>(false);

  // input 상태 관리
  const stateHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.indexOf(' ') !== -1) {
      dispatch(showAlert('blank'));
    }
    if (e.target.id === 'email') {
      setUserInfo({
        ...userInfo,
        email: e.target.value.replace(/ /g, ''),
      });
    } else if (e.target.id === 'nickname') {
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
    } else if (e.target.id === 'auth' && isNumber(e.target.value)) {
      setUserInfo({
        ...userInfo,
        auth: e.target.value.replace(/ /g, ''),
      });
    }
  };

  // 에러 메세지
  const [error, setError] = useState<IError>({
    passwordError: '', // 비밀번호 불일치
    authError: '', // 인증번호 불일치
    existEmailError: '',
  });

  // 버튼 활성화
  const [isDisable, setIsDisable] = useState<IDisable>({
    authDisable: true,
    singUpDisable: true,
    emailDisable: false,
  });

  // 인증번호 요청 버튼 활성화 관련
  useEffect((): void => {
    if (
      userInfo.nickname === '' ||
      userInfo.password === '' ||
      userInfo.rePassword === '' ||
      !isValidEmail(userInfo.email)
    ) {
      setIsDisable({
        ...isDisable,
        authDisable: true,
      });
    } else {
      setIsDisable({
        ...isDisable,
        authDisable: false,
      });
    }
  }, [userInfo]);

  // 회원가입 버튼 활성화 관련
  useEffect((): void => {
    if (userInfo.auth === '') {
      setIsDisable({
        ...isDisable,
        singUpDisable: true,
      });
    } else {
      setIsDisable({
        ...isDisable,
        singUpDisable: false,
      });
    }
  }, [userInfo.auth]);

  // 엔터 단축키 관련
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (!isExistAlert) {
      const target = e.target as HTMLInputElement;
      if (
        target.id === 'email' &&
        isValidEmail(userInfo.email) &&
        e.code === 'Enter'
      ) {
        nicknameRef.current?.focus();
      } else if (target.id === 'nickname' && e.code === 'Enter') {
        passwordRef.current?.focus();
      } else if (target.id === 'password' && e.code === 'Enter') {
        rePasswordRef.current?.focus();
      } else if (
        target.id === 're-password' &&
        !isDisable.authDisable &&
        e.code === 'Enter'
      ) {
        reuqestEmailAuth();
      }
      if (
        target.id === 'auth' &&
        e.code === 'Enter' &&
        !isDisable.singUpDisable
      ) {
        requestSignup();
      }
    }
  };

  // 타이머
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [min, setMin] = useState<number>(3);
  const [sec, setSec] = useState<number>(0);
  const time = useRef<number>(179);
  const timerId = useRef<any>();
  const [count, setCount] = useState<number>(0);

  useEffect((): void => {
    // 시간이 끝난 경우
    if (time.current < 0) {
      clearInterval(timerId.current);
      setAuthNumber('');
      setShowAuthNumber(false);
    }
  }, [sec]);

  // 인증번호 요청
  const reuqestEmailAuth = (): void => {
    if (userInfo.password !== userInfo.rePassword) {
      setError({
        authError: '',
        existEmailError: '',
        passwordError: '비밀번호가 일치하지 않습니다.',
      });
      passwordRef.current?.focus();
    } else {
      setError({
        authError: '',
        existEmailError: '',
        passwordError: '',
      });
      setShowAuthNumber(false);
      setShowTimer(false);
      setIsDisable({
        ...isDisable,
        authDisable: true,
      });
      clearInterval(timerId.current);
      time.current = 180;
      setMin(3);
      setSec(0);
      timerId.current = setInterval(() => {
        setMin(parseInt(String(time.current / 60)));
        setSec(time.current % 60);
        time.current -= 1;
      }, 1000);
      const callback = (code: number, data: string) => {
        if (code === 200) {
          setUserInfo({
            ...userInfo,
            auth: '',
          });
          setAuthNumber(String(data));
          setIsDisable({
            ...isDisable,
            authDisable: false,
          });
          setShowAuthNumber(true);
          setShowTimer(true);
          setIsDisable({
            ...isDisable,
            emailDisable: true,
          });
          setCount(count + 1);
          authRef.current?.focus();
        } else {
          clearInterval(timerId.current);
          setError({
            authError: '',
            existEmailError: data,
            passwordError: '',
          });
          setIsDisable({
            ...isDisable,
            authDisable: false,
          });
          emailRef.current?.focus();
        }
      };
      userApi(
        'emailAuthSignup',
        { email: userInfo.email, type: 'signup' },
        callback,
      );
    }
  };

  // 회원가입 요청
  const requestSignup = (): void => {
    // 인증번호가 일치하지 않을 경우
    if (userInfo.auth !== authNumber) {
      setError({
        ...error,
        authError: '인증번호가 일치하지 않습니다.',
      });
      authRef.current?.focus();
    } else {
      setError({
        ...error,
        authError: '',
      });
      const body = {
        email: userInfo.email,
        nick_name: userInfo.nickname,
        password: userInfo.password,
      };
      const callback = (code: number, data: string) => {
        if (code === 201) {
          dispatch(updateUrl('signup'));
          dispatch(updateAccessToken(data));
          clearInterval(timerId.current);
        }
      };
      userApi('signup', body, callback);
    }
  };

  useEffect(() => {
    console.log(authNumber);
  }, [authNumber]);

  return (
    <>
      <AuthContainer>
        <>
          <div className="flex justify-center items-center space-x-2">
            <Logo />
          </div>
          <p className="inline-flex mt-6 w-96 text-gray-600 text-sm">
            기본 정보 (이메일로 가입)
          </p>
          <div className="mt-2">
            <input
              id="email"
              className="border-2 w-96 border-slate-200 h-12 rounded-md pl-2 outline-main"
              type={'text'}
              value={userInfo.email}
              onChange={(e) => {
                stateHandler(e);
              }}
              placeholder="이메일을 입력해주세요"
              onKeyPress={(e) => {
                pressEnter(e);
              }}
              disabled={isDisable.emailDisable}
              ref={emailRef}
            />
          </div>
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
              onKeyPress={(e) => {
                pressEnter(e);
              }}
              ref={nicknameRef}
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
              onKeyPress={(e) => {
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
              onKeyPress={(e) => {
                pressEnter(e);
              }}
              placeholder="비밀번호를 한번 더 입력해주세요"
              ref={rePasswordRef}
            />
          </div>
          <div className="mt-2">
            <div className="inline-flex relative w-96 justify-end">
              {showTimer && (
                <p className="text-red-400 absolute top-2 right-40 text-sm">
                  {time.current !== -1
                    ? `${min}분 ${sec}초`
                    : '인증시간을 초과하였습니다.'}
                </p>
              )}
              {(error.existEmailError || error.passwordError) && (
                <p className="text-red-400 absolute top-2 right-40 text-sm">
                  {error.existEmailError || error.passwordError}
                </p>
              )}
              <button
                className={`w-36 h-10 rounded-md ${
                  isDisable.authDisable
                    ? 'bg-slate-100 text-slate-300'
                    : 'bg-main text-white hover:bg-orange-700'
                }`}
                disabled={isDisable.authDisable}
                onClick={reuqestEmailAuth}
              >
                {count ? '인증번호 재요청' : '인증번호 요청'}
              </button>
            </div>
          </div>
          {showAuthNumber && (
            <>
              <p className="inline-flex mt-4 w-96 text-gray-600 text-sm">
                이메일 인증
              </p>
              <div className="mt-2">
                <input
                  id="auth"
                  className="border-2 w-96 border-slate-200 h-12 rounded-md pl-2 outline-main"
                  type={'text'}
                  value={userInfo.auth}
                  maxLength={6}
                  onChange={(e) => {
                    stateHandler(e);
                  }}
                  placeholder="인증번호 6자리를 입력해주세요"
                  onKeyPress={(e) => {
                    pressEnter(e);
                  }}
                  ref={authRef}
                />
              </div>
              {error.authError && (
                <p className="inline-flex text-red-400 w-96 pl-2 text-sm">
                  {error.authError}
                </p>
              )}
              <div className="mt-6">
                <button
                  className={`w-96 h-12 rounded-md ${
                    isDisable.singUpDisable
                      ? 'bg-slate-100 text-slate-300'
                      : 'bg-main text-white hover:bg-orange-700'
                  }`}
                  disabled={isDisable.singUpDisable}
                  onClick={requestSignup}
                >
                  회원가입
                </button>
              </div>
            </>
          )}
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

export default Join;
