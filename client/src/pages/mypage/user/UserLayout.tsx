import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import LeftPannel from '../../../components/layout/LeftPannel';
import { useAppSelector } from '../../../config/hooks';
import List from './List';
import Report from './Report';

interface IOption {
  id: string;
  label: string;
  index: number;
}

const UserLayout = () => {
  const options: IOption[] = [
    { id: 'list', label: '전체유저 목록', index: 0 },
    { id: 'report', label: '신고유저 목록', index: 1 },
  ];

  return (
    <>
      <LeftPannel options={options} type={'user'} />
      <div className="w-5/6 text-left pl-4 pb-6">
        <Switch>
          <Route path="/list" element={<List />} />
          <Route path="/report" element={<Report />} />
        </Switch>
      </div>
    </>
  );
};

export default UserLayout;
