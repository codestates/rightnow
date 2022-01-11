import React from 'react';
import defaultImage from '../../../images/profile.png';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';

const List = () => {
  return (
    <>
      <div className="text-lg font-semibold">친구 목록</div>
      <div className="w-135 mt-4">
        <div className="flex relative items-center border-b-1 py-2">
          <img
            src={defaultImage}
            alt="user-profile"
            width={50}
            className="rounded-full"
          />
          <div className="ml-5 text-sub font-semibold">장세진</div>
          <div className="absolute right-0">
            <IconButton size={'small'}>
              <MoreVertIcon />
            </IconButton>
          </div>
          <div className='absolute right-0 top-12 rounded-md bg-white shadow-md text-sm text-center py-2 border-1'>
            <div className=' hover:bg-gray-100 px-4 py-2 cursor-pointer'>친구 삭제</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
