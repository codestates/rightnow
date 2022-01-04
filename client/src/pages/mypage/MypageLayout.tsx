import React, { useEffect, useState } from 'react';
import { Route, Routes as Switch, Link, useLocation } from 'react-router-dom';
import FriendsLayout from './friends/FriendsLayout';
import AccountLayout from './account/AccountLayout';

interface IOption {
  id: string;
  label: string;
}

const MypageLayout = () => {
  const location = useLocation();
  // mypage 옵션
  const headerOption: IOption[] = [
    { id: 'friends', label: '친구관리' },
    { id: 'account', label: '계정관리' },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    location.pathname.split('/')[2],
  );

  useEffect(() => {
    setSelectedId(location.pathname.split('/')[2])
  },[location])

  return (
    <>
      <header className="mt-1 text-center bg-white h-10 shadow-md fixed top-16 w-screen">
        <div className="inline-flex w-222 h-full items-center relative">
          {headerOption.map((v, i) => {
            const { id, label } = v;
            return (
              <Link
                to={
                  id === 'friends'
                    ? '/mypage/friends/list'
                    : '/mypage/account/profile'
                }
                key={id}
              >
                <div
                  className={`text-sm cursor-pointer ${i !== 0 && 'ml-4'} ${
                    selectedId === id
                      ? 'text-gray-600 font-semibold'
                      : 'text-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedId(id);
                  }}
                >
                  {label}
                </div>
              </Link>
            );
          })}
          <div
            className={`inline-block bg-main h-0.75 rounded-sm absolute bottom-0 transition-all ${
              selectedId === 'friends' ? 'w-14 left-0' : 'w-14 left-18'
            }`}
          />
        </div>
      </header>
      <main className="mt-1 text-center pt-30">
        <div className="inline-flex w-222">
          <Switch>
            <Route path="/friends/*" element={<FriendsLayout />} />
            <Route path="/account/*" element={<AccountLayout />} />
          </Switch>
        </div>
      </main>
    </>
  );
};

export default MypageLayout;
