import React, { useEffect, useState } from 'react';
import { Route, Routes as Switch, useLocation, useNavigate } from 'react-router-dom';
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
} from './reducers/userSlice';
import MypageLayout from './pages/mypage/MypageLayout';
import AuthLayout from './pages/auth/AuthLayout';
import Search from './pages/Search';
import { showAlert, updateUrl, url } from './reducers/componetSlice';
import Alert from './components/Alert';

function Routes() {
  const router = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(userAccessToken);
  const isLogin = useAppSelector(userIsLogin);
  const prevPage = useAppSelector(url);
  // useEffect(() => {
  //   if (accessToken) {
  //     const callback = (code: number, data: IUserInfo) => {
  //       if (code === 200) {
  //         console.log('아직 accessToken이 살아있음')
  //         console.log(data)
  //       }
  //     };
  //     userApi('getUserInfo', undefined, callback, accessToken);
  //   }
  // }, [location]);

  // accessToken이 새롭게 받아질 때 마다 유저의 정보를 갱신시켜준다.
  const [first, setFirst] = useState<boolean>(true);
  useEffect(() => {
    if (!first) {
      if (accessToken) {
        const callback = (code: number, data: IUserInfo) => {
          if (code === 200) {
            dispatch(getUserInfo(data));
          }
        };
        userApi('getUserInfo', undefined, callback, accessToken);
      } else {
        router('/');
        dispatch(logout());
      }
    }
  }, [accessToken]);

  // 갱신된 유저의 정보중에 login관련 변동이 있다면 유저를 상황에 맞게 다이렉팅 시킨다.
  useEffect(() => {
    if (!first) {
      if (isLogin) {
        router('/room');
        dispatch(showAlert('login'));
      } else {
        if (prevPage === 'deleteAccount') {
          dispatch(showAlert('signout'));
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
      </Switch>
      <Alert />
    </>
  );
}

export default Routes;
