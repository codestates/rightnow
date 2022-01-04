import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import Profile from './Profile';
import LeftPannel from '../../../components/layout/LeftPannel';

interface IOption {
  id: string;
  label: string;
}

const AccountLayout = () => {
  const options: IOption[] = [
    {
      id: 'profile',
      label: '프로필 설정',
    },
    { id: 'changePassword', label: '비밀번호 변경' },
    { id: 'deleteAccount', label: '계정 삭제' },
  ];

  return (
    <>
      <LeftPannel options={options} type={'account'} />
      <div className="w-5/6 text-left pl-4">
        <Switch>
          <Route path="/Profile" element={<Profile />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/deleteAccount" element={<DeleteAccount />} />
        </Switch>
      </div>
    </>
  );
};

export default AccountLayout;
