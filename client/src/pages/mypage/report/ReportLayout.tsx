import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import LeftPannel from '../../../components/layout/LeftPannel';
import Room from './Room';
import User from './User';

// interface IOption {
//   id: string;
//   label: string;
//   index: number;
// }

const ReportLayout = () => {
  // const options: IOption[] = [
  //   {
  //     id: 'user',
  //     label: '신고유저 목록',
  //     index: 0,
  //   },
  //   { id: 'room', label: '신고 방 목록', index: 1 },
  // ];

  return (
    <>
      {/* <LeftPannel options={options} type={'report'} /> */}
      <div className="w-full text-left pb-6">
        <Switch>
          <Route path="/user" element={<User />} />
          <Route path="/room" element={<Room />} />
        </Switch>
      </div>
    </>
  );
};

export default ReportLayout;
