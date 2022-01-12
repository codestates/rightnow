import React, { useEffect } from 'react';
import { Route, Routes as Switch, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../config/hooks';
import Header from '../../components/layout/Header';
import Join from './Join';
import Login from './Login';
import ResetPassword from './ResetPassword';
import { userIsLogin } from '../../reducers/userSlice';
import TempJoin from './TempJoin';

const AuthLayout = () => {
  const isLogin = useAppSelector(userIsLogin);
  const router = useNavigate();

  useEffect(() => {
    if (isLogin) {
      router('/search')
    }
  }, []);

  return (
    <>
      <Header />
      <Switch>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/tempJoin" element={<TempJoin />} />
      </Switch>
    </>
  );
};

export default AuthLayout;
