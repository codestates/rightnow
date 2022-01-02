import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import RendingPage from './pages/index';
import Login from './pages/auth/Login';
import Join from './pages/auth/Join';
import ResetPassword from './pages/auth/ResetPassword';
import Room from './pages/Room';
import Header from './components/layout/Header';

function Routes() {
  return (
    <>
      <Header />
      <Switch>
        <Route path='/' element={<RendingPage />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/join' element={<Join />} />
        <Route path='/auth/ResetPassword' element={<ResetPassword />} />
        <Route path='/room' element={<Room />} />
      </Switch>
    </>
  );
}

export default Routes;
