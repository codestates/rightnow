import React, { useEffect, useState } from 'react';
import {
  Route,
  Routes as Switch,
  useLocation,
  useNavigate,
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
  userEmail,
} from './reducers/userSlice';
import MypageLayout from './pages/mypage/MypageLayout';
import AuthLayout from './pages/auth/AuthLayout';
import Search from './pages/Search';
import {
  componetSlice,
  showAlert,
  updateUrl,
  url,
} from './reducers/componetSlice';
import Alert from './components/Alert';
import Load from './pages/Load';
import { SettingsOutlined } from '@material-ui/icons';

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
  const email = useAppSelector(userEmail);

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
  }, [location]);

  useEffect(() => {
    if (location.search) {
      const kakaoAuthCode = location.search.split('code=')[1];
      // const googleAuthCode = location.search.split('code=')[1];
      // const googleAuthCode = location.search.split('code=')[1].split('&')[0];
      if (kakaoAuthCode) {
        const body = {
          code: kakaoAuthCode,
        };

        const callback = (code: number, data: string): void => {
          if (code === 201) {
            dispatch(updateAccessToken(data));
          }
        };
        userApi('kakaoLogin', body, callback);
      }
      // if (googleAuthCode) {
      //   console.log('google')
      //   const body = {
      //     code: googleAuthCode,
      //   };
      //   const callback = (code: number, data: IData): void => {};
      //   userApi('googleLogin', body, callback);
      // }
    }
  }, []);

  // accessToken이 새롭게 받아질 때 마다 유저의 정보를 갱신시켜준다.
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

  // 갱신된 유저의 정보중에 login관련 변동이 있다면 유저를 상황에 맞게 다이렉팅 시킨다.
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

  return (
    <>
      <Switch>
        <Route path="/" element={<RendingPage />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/mypage/*" element={<MypageLayout />} />
        <Route path="/room" element={<Room />} />
        <Route path="/search" element={<Search />} />
        <Route path="/load" element={<Load />} />
      </Switch>
      <Alert />
    </>
  );
}

export default Routes;
