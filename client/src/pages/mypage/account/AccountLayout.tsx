import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import Profile from './Profile';
import LeftPannel from '../../../components/layout/LeftPannel';
import { useAppSelector } from '../../../config/hooks';
import { userRole, userSocialLogin } from '../../../reducers/userSlice';

interface IOption {
  id: string;
  label: string;
  index: number;
}

const AccountLayout = () => {
  // 일반 로그인 or 임시 로그인
  const role = useAppSelector(userRole);
  // 로그인 경로(일반 로그인 or 소셜로그인)
  const socialLogin = useAppSelector(userSocialLogin);

  const options: IOption[] =
    socialLogin === 'original'
      ? [
          {
            id: 'profile',
            label: '프로필 설정',
            index: 0,
          },
          { id: 'changePassword', label: '비밀번호 변경', index: 1 },
          { id: 'deleteAccount', label: '계정 삭제', index: 2 },
        ]
      : [
          {
            id: 'profile',
            label: '프로필 설정',
            index: 0,
          },
          { id: 'deleteAccount', label: '계정 삭제', index: 1 },
        ];

  return (
    <>
      <LeftPannel options={options} type={'account'} />
      <div className="w-5/6 text-left pl-4 pb-6">
        {role === 'TEMP' ? (
          <div className="mt-2 font-semibold text-sub">
            회원가입을 통해 만든 계정으로 이용 할 수 있습니다.
          </div>
        ) : (
          <Switch>
            <Route path="/Profile" element={<Profile />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/deleteAccount" element={<DeleteAccount />} />
          </Switch>
        )}
      </div>
    </>
  );
};

export default AccountLayout;
