import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../config/hooks';
import { userRequestFriendCount } from '../../reducers/userSlice';

interface IOption {
  id: string;
  label: string;
  index: number;
}

interface IProps {
  options: IOption[];
  type: string;
}

const LeftPannel = ({ options, type }: IProps) => {
  const location = useLocation();
  // user의 친구 요청 수
  const requestFriendCount = useAppSelector(userRequestFriendCount);
  // 사용자가 선택한 id
  const [selectedId, setSelectedId] = useState<string>(
    location.pathname.split('/')[3],
  );
  // 사용자가 선택한 id 인덱스
  const [selectedIdIndex, setSelectedIdIndex] = useState<number>(0);
  useEffect(() => {
    const idx = options.findIndex((v) => {
      return v.id === location.pathname.split('/')[3];
    });
    setSelectedId(location.pathname.split('/')[3]);
    setSelectedIdIndex(options[idx].index);
  }, [location]);
  return (
    <div className="w-56 text-sm text-gray-600 text-left space-y-1 relative">
      {options.map((lefpannelOption, idx) => {
        const { id, label, index } = lefpannelOption;
        return (
          <Link
            to={
              type === 'account'
                ? `/mypage/account/${id}`
                : type === 'friends'
                ? `/mypage/friends/${id}`
                : type === 'report'
                ? `/mypage/report/${id}`
                : `/mypage/category/${id}`
            }
            key={id}
            onClick={() => {
              setSelectedId(id);
              setSelectedIdIndex(index);
            }}
          >
            <div
              className={`pl-2 py-2 rounded-md cursor-pointer  ${
                id === selectedId && id === 'deleteAccount'
                  ? 'text-red-500 font-semibold'
                  : id === selectedId
                  ? 'text-sub font-semibold'
                  : id === 'deleteAccount'
                  ? 'text-red-500 hover:bg-gray-100 hover:font-semibold'
                  : 'text-sub hover:bg-gray-100 hover:font-semibold'
              }`}
              // onClick={() => {
              //   setSelectedId(id);
              //   setSelectedIdIndex(index);
              // }}
            >
              <span>{label}</span>
              {id === 'request' && requestFriendCount !== 0 && (
                <div className=" bg-main text-white rounded-full inline-flex justify-center items-center min-w-5 px-1 ml-2">
                  {requestFriendCount}
                </div>
              )}
            </div>
          </Link>
        );
      })}
      <div
        className={`rounded-md cursor-pointer absolute left-0 w-full h-8 -z-10 transition-all ${
          selectedId === 'deleteAccount' ? 'bg-gray-100' : 'bg-main'
        }`}
        style={{
          top: selectedIdIndex === 0 ? -1 : selectedIdIndex === 1 ? 34 : 69,
        }}
      />
    </div>
  );
};
export default LeftPannel;
