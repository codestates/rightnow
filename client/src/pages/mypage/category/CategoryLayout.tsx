import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import LeftPannel from '../../../components/layout/LeftPannel';
import { useAppSelector } from '../../../config/hooks';
import Create from './Create';
import List from './List';

interface IOption {
  id: string;
  label: string;
  index: number;
}

const CategoryLayout = () => {
  const options: IOption[] = [
    {
      id: 'list',
      label: '카테고리 목록',
      index: 0,
    },
    { id: 'create', label: '카테고리 생성', index: 1 },
  ];

  return (
    <>
      <LeftPannel options={options} type={'category'} />
      <div className="w-5/6 text-left pl-4 pb-6">
        <Switch>
          <Route path="/list" element={<List />} />
          <Route path="/create" element={<Create />} />
        </Switch>
      </div>
    </>
  );
};

export default CategoryLayout;
