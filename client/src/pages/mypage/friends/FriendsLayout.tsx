import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import LeftPannel from '../../../components/layout/LeftPannel';
import List from './List';
import Add from './Add';

interface IOption {
  id: string;
  label: string;
}

const FriendsLayout = () => {
  const options: IOption[] = [
    {
      id: 'list',
      label: '친구 목록',
    },
    { id: 'add', label: '친구 추가' },
  ];

  return (
    <>
      <LeftPannel options={options} type={'friends'} />
      <div className="w-5/6 text-left pl-4">
        <Switch>
          <Route path="/list" element={<List />} />
          <Route path="/add" element={<Add />} />
        </Switch>
      </div>
    </>
  );
};

export default FriendsLayout;
