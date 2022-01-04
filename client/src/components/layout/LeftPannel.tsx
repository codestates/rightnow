import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// import Link from "next/link";
// import { useRouter } from "next/router";

interface IOption {
  id: string;
  label: string;
}

interface IProps {
  options: IOption[];
  type: string;
}

const LeftPannel = ({ options, type }: IProps) => {
  const location = useLocation();
  const [selectedId, setSelectedId] = useState<string>(
    location.pathname.split('/')[3],
  );
  useEffect(() => {
    setSelectedId(location.pathname.split('/')[3]);
  }, [location]);
  return (
    <div className="w-56 text-sm text-gray-600 text-left space-y-1 relative">
      {options.map((v, i) => {
        const { id, label } = v;
        return (
          <Link
            to={
              type === 'account'
                ? `/mypage/account/${id}`
                : `/mypage/friends/${id}`
            }
            key={id}
            onClick={() => {
              setSelectedId(id);
            }}
          >
            <div
              className={`pl-2 py-2 rounded-md cursor-pointer  ${
                id === selectedId
                  ? 'text-black font-semibold'
                  : // ? 'bg-main text-black font-semibold'
                    'hover:bg-gray-200'
              }`}
              onClick={() => {
                setSelectedId(id);
              }}
            >
              <span>{label}</span>
            </div>
          </Link>
        );
      })}
      <div
        className={`rounded-md cursor-pointer absolute left-0 w-full h-8 -z-10 transition-all bg-main`}
        style={{
          top:
            selectedId === 'profile' || selectedId === 'list'
              ? -1
              : selectedId === 'changePassword' || selectedId === 'add'
              ? 34
              : 69,
        }}
      />
    </div>
  );
};

export default LeftPannel;
