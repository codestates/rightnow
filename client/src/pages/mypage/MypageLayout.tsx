import React, { useEffect, useState } from 'react';
import {
  Route,
  Routes as Switch,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import FriendsLayout from './friends/FriendsLayout';
import AccountLayout from './account/AccountLayout';
import Header from '../../components/layout/Header';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import {
  updateRequestFriendCount,
  updateRequestFriendList,
  userEmail,
  userIsLogin,
  userRequestFriendList,
  userRole,
} from '../../reducers/userSlice';
import friendsApi from '../../api/friendsApi';
import ReportLayout from './report/ReportLayout';
import CategoryLayout from './category/CategoryLayout';

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

const MypageLayout = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  // 유저 role
  const role = useAppSelector(userRole);
  // 유저 친구요청 목록
  const requestFriendList = useAppSelector(userRequestFriendList);
  // 유저 이메일
  const email = useAppSelector(userEmail);
  // mypage 옵션
  const mypageOption: IOption[] =
    role === 'ADMIN'
      ? [
          { id: 'friends', label: '친구관리' },
          { id: 'account', label: '계정관리' },
          { id: 'report', label: '신고관리' },
          { id: 'category', label: '카테고리' },
        ]
      : [
          { id: 'friends', label: '친구관리' },
          { id: 'account', label: '계정관리' },
        ];

  const [selectedId, setSelectedId] = useState<string>(
    location.pathname.split('/')[2],
  );

  useEffect((): void => {
    setSelectedId(location.pathname.split('/')[2]);
  }, [location]);

  // 로그인 상태가 아닐 경우 첫 페이지로 리다이렉팅
  const isLogin = useAppSelector(userIsLogin);
  const router = useNavigate();

  // 로그인 상태가 아닐 경우, 로그인 상태 일 경우 분기처리
  useEffect((): void => {
    if (!isLogin) {
      router('/');
    } else {
      // 친구요청 수 불러오기
      const callback = (code: number, data: IData[]): void => {
        if (code === 200) {
          const newData = data.map((obj, idx) => {
            const { email } = obj;
            return email;
          });
          if (JSON.stringify(requestFriendList) !== JSON.stringify(newData)) {
            dispatch(updateRequestFriendList(newData));
            dispatch(updateRequestFriendCount(newData.length));
          }
        }
      };
      friendsApi('getFriendRequestList', {}, callback, email);
    }
  }, []);

  return (
    <>
      <Header />
      <header className="mt-0 text-center bg-white h-10 shadow-md fixed top-16 w-screen z-20">
        <div className="inline-flex w-222 h-full items-center relative">
          {mypageOption.map((v, i) => {
            const { id, label } = v;
            return (
              <Link
                to={
                  id === 'friends'
                    ? '/mypage/friends/list'
                    : id === 'account'
                    ? '/mypage/account/profile'
                    : id === 'report'
                    ? '/mypage/report/user'
                    : '/mypage/category/list'
                }
                key={id}
              >
                <div
                  className={`text-sm cursor-pointer ${i !== 0 && 'ml-4'} ${
                    selectedId === id
                      ? 'text-sub font-semibold'
                      : 'text-gray-300 hover:text-sub'
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
              selectedId === 'friends'
                ? 'w-14 left-0'
                : selectedId === 'account'
                ? 'w-14 left-18'
                : selectedId === 'report'
                ? 'w-14 left-36'
                : 'w-14 left-54'
            }`}
          />
        </div>
      </header>
      <main className="mt-1 text-center pt-30">
        <div className="inline-flex w-222">
          <Switch>
            <Route path="/friends/*" element={<FriendsLayout />} />
            <Route path="/account/*" element={<AccountLayout />} />
            <Route path="/report/*" element={<ReportLayout />} />
            <Route path="/category/*" element={<CategoryLayout />} />
          </Switch>
        </div>
      </main>
    </>
  );
};

export default MypageLayout;
