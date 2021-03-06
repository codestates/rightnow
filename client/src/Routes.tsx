import React, { useEffect, useState } from 'react';
import {
  Route,
  Routes as Switch,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import RendingPage from './pages/index';
import Room from './pages/Room';
import userApi from './api/userApi';
import { useAppSelector, useAppDispatch } from './config/hooks';
import {
  userAccessToken,
  getUserInfo,
  IUserInfo,
  userIsLogin,
  logout,
  updateAccessToken,
  deleteAccessToken,
  userProfile,
  userIsBlock,
  updateBlockDate,
} from './reducers/userSlice';
import MypageLayout from './pages/mypage/MypageLayout';
import AuthLayout from './pages/auth/AuthLayout';
import Search from './pages/Search';
import {
  mypageMenu,
  showAlert,
  showMypage,
  updateUrl,
  url,
} from './reducers/componetSlice';
import Alert from './components/Alert';
import Load from './pages/Load';
import Policy from './pages/Policy';

interface IData {
  userInfo: IUserInfo;
  accessToken?: string;
}
export const useTitle = (initialTitle: string) => {
  const [title, setTitle] = useState<string>(initialTitle);

  useEffect(() => {
    const htmlTitle = document.querySelector('title') as HTMLTitleElement;
    htmlTitle.innerText = title;
  }, [title]);

  return setTitle;
};

function Routes() {
  const router = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(userAccessToken);
  const isLogin = useAppSelector(userIsLogin);
  const prevPage = useAppSelector(url);
  const profile_image = useAppSelector(userProfile);
  const isVisibleMypageMenu = useAppSelector(mypageMenu);
  const isBlock = useAppSelector(userIsBlock);

  useEffect(() => {
    if (accessToken) {
      const callback = (code: number, data: IData) => {
        if (code === 200) {
          if (data.accessToken) {
            dispatch(updateAccessToken(data.accessToken));
          }
        } else if (code === 400) {
          dispatch(showAlert('invalidRefreshToken'));
        } else if (code === 404) {
          dispatch(updateUrl('temperedToken'));
          dispatch(deleteAccessToken());
        }
      };
      userApi('getUserInfo', undefined, callback, accessToken);
    }
    // ?????? ??? ????????? ?????? ?????? ???????????? ?????????.
    if (isBlock === 'Y') {
      dispatch(showAlert('blockedUser'));
    }
  }, [location]);

  useEffect(() => {
    if (location.search) {
      const kakaoAuthCode = location.search.split('code=')[1];
      const googleSearch = location.search.split('message=')[1];
      if (kakaoAuthCode) {
        const body = {
          code: kakaoAuthCode,
        };
        const callback = (code: number, data: string): void => {
          if (code === 200) {
            dispatch(updateAccessToken(data));
          } else if (code === 404) {
            dispatch(updateBlockDate(data));
            dispatch(showAlert('loginBlock'));
            router('/auth/login');
          }
        };
        userApi('kakaoLogin', body, callback);
      }
      if (googleSearch) {
        const message = googleSearch.split('&')[0];
        if (message === 'ok') {
          const callback = (code: number, data: IData) => {
            if (code === 200) {
              if (data.accessToken) {
                dispatch(updateAccessToken(data.accessToken));
              }
            } else if (code === 400) {
              dispatch(showAlert('invalidRefreshToken'));
              router('/auth/login');
            } else if (code === 404) {
              dispatch(updateUrl('temperedToken'));
              dispatch(deleteAccessToken());
              router('/auth/login');
            }
          };
          userApi('getUserInfo', undefined, callback, accessToken);
        } else if (message === 'block_user') {
          const data = googleSearch.split('&')[1].split('&')[0].split('=')[1];
          router('/auth/login');
          dispatch(updateBlockDate(data));
          dispatch(showAlert('loginBlock'));
        } else if (message === 'err') {
          router('/');
          dispatch(showAlert('accessDenied'));
        }
      }
    }
  }, []);

  // accessToken??? ????????? ????????? ??? ?????? ????????? ????????? ??????????????????.
  const [first, setFirst] = useState<boolean>(true);
  useEffect(() => {
    if (!first) {
      if (accessToken) {
        const callback = (code: number, data: IData): void => {
          if (code === 200) {
            dispatch(getUserInfo(data.userInfo));
          }
        };
        userApi('getUserInfo', undefined, callback, accessToken);
      } else {
        router('/');
        dispatch(logout());
        userApi('logout');
      }
    }
  }, [accessToken]);

  // ????????? ????????? ???????????? login?????? ????????? ????????? ????????? ????????? ?????? ???????????? ?????????.
  useEffect(() => {
    if (!first) {
      if (isLogin) {
        router('/search');
        if (prevPage === 'signup') {
          dispatch(showAlert('signup'));
          dispatch(updateUrl(''));
        } else if (prevPage === 'tempSignup') {
          dispatch(showAlert('tempSignup'));
          dispatch(updateUrl(''));
        } else {
          dispatch(showAlert('login'));
        }
      } else {
        if (prevPage === 'deleteAccount') {
          dispatch(showAlert('signout'));
          dispatch(updateUrl(''));
        } else if (prevPage === 'temperedToken') {
          dispatch(showAlert('temperedToken'));
          dispatch(updateUrl(''));
        } else {
          dispatch(showAlert('logout'));
        }
      }
    }
    setFirst(false);
  }, [isLogin]);

  // ????????? enter??? ?????? ??? ?????? ??? ??????
  useEffect(() => {
    document.body.addEventListener('keypress', (e) => {
      if (e.code === 'Enter') {
        dispatch(showAlert(''));
      }
    });
  }, []);

  document.body.addEventListener('click', () => {
    if (isVisibleMypageMenu) {
      dispatch(showMypage(false));
    }
  });

  return (
    <>
      <Switch>
        <Route path="/" element={<RendingPage />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/mypage/*" element={<MypageLayout />} />
        <Route path="/room" element={<Room />} />
        <Route path="/search" element={<Search />} />
        <Route path="/load" element={<Load />} />
        <Route path="/policy" element={<Policy />} />
      </Switch>
      <Alert />
    </>
  );
}

export default Routes;
