import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Join from './Join';
import Login from './Login';
import ResetPassword from './ResetPassword';

const AuthLayout = () => {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Switch>
    </>
  );
};

export default AuthLayout;
