import React, { useEffect } from 'react';
import { Route, Routes as Switch, useLocation } from 'react-router-dom';
import RendingPage from './pages/index';
import Login from './pages/auth/Login';
import Join from './pages/auth/Join';
import ResetPassword from './pages/auth/ResetPassword';
import Room from './pages/Room';
import Header from './components/layout/Header';
import userApi from './api/userApi';
import { useAppSelector, useAppDispatch } from './config/hooks';
import { userAccessToken, getUserInfo, IUserInfo } from './reducers/userSlice';
import MypageLayout from './pages/mypage/MypageLayout';
import Matching from './pages/Matching';

function Routes() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(userAccessToken);
  useEffect(() => {
    if (accessToken) {
      const callback = (code: number, data: IUserInfo) => {
        if (code === 200) {
          dispatch(getUserInfo(data));
        }
      };
      userApi('getUserInfo', undefined, callback, accessToken);
    }
  }, [location]);
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" element={<RendingPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/join" element={<Join />} />
        <Route path="/auth/resetPassword" element={<ResetPassword />} />
        <Route path="/mypage/*" element={<MypageLayout />} />
        <Route path="/room" element={<Room />} />
        <Route path="/match" element={<Matching />} />
      </Switch>
    </>
  );
}

export default Routes;
