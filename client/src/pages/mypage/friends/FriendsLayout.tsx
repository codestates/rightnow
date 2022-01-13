import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import LeftPannel from '../../../components/layout/LeftPannel';
import List from './List';
import Add from './Add';
import Request from './Request';
import { useAppSelector } from '../../../config/hooks';
import { userRole } from '../../../reducers/userSlice';

interface IOption {
  id: string;
  label: string;
}

interface IData {
  email: string;
  nick_name: string;
  profile_image: string;
  role: string;
  social_login: string;
  auth_code: string;
  is_block: string;
  block_date: string;
  createdAt: string;
  updatedAt: string;
}

const FriendsLayout = () => {

  const role = useAppSelector(userRole);

  const options: IOption[] = [
    {
      id: 'list',
      label: '친구 목록',
    },
    { id: 'add', label: '친구 추가' },
    { id: 'request', label: '친구 요청' },
  ];



  return (
    <>
      <LeftPannel options={options} type={'friends'} />
      <div className="w-5/6 text-left pl-4 pb-6">
        {role === 'TEMP' ? (
          <div className="mt-2 font-semibold text-sub">
            회원가입을 통해 만든 계정으로 이용 할 수 있습니다.
          </div>
        ) : (
          <Switch>
            <Route path="/list" element={<List />} />
            <Route path="/add" element={<Add />} />
            <Route path="/request" element={<Request />} />
          </Switch>
        )}
      </div>
    </>
  );
};

export default FriendsLayout;
