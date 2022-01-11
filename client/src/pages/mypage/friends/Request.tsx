import React from 'react';
import defaultImage from '../../../images/profile.png';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';

const Request = () => {
  return (
    <>
      <div className="text-lg font-semibold">친구 요청</div>
      <div className="w-135 mt-4">
        <div className="flex relative items-center border-b-1 py-2">
          <img
            src={defaultImage}
            alt="user-profile"
            width={50}
            className="rounded-full"
          />
          <div className="ml-5 font-semibold text-sub">장세진</div>
          <div className="absolute right-0 flex items-center space-x-2">
            <div className=' bg-main py-1.5 px-4 text-sm text-white rounded-md text-center hover:bg-orange-700 cursor-pointer'>
              수락
            </div>
            <div className=' border-1 border-main py-1.5 px-4 text-sm text-main rounded-md text-center hover:bg-gray-100 cursor-pointer'>
              거절
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Request;
