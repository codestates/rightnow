import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../config/store';

export interface IUserInfo {
  email: string;
  nick_name: string;
  profile_image: string;
  role: string;
  is_block: string;
  block_date: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  userInfo: IUserInfo;
  isLogin: boolean;
  accessToken: string;
}

const initialState: UserState = {
  userInfo: {
    email: '',
    nick_name: '',
    profile_image: '',
    role: '',
    is_block: '',
    block_date: '',
    createdAt: '',
    updatedAt: '',
  },
  isLogin: false,
  accessToken: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    deleteAccessToken: (state) => {
      state.accessToken = '';
    },
    getUserInfo: (state, action: PayloadAction<IUserInfo>) => {
      state.userInfo = action.payload;
      state.isLogin = true;
    },
    logout: (state) => {
      state.userInfo = {
        email: '',
        nick_name: '',
        profile_image: '',
        role: '',
        is_block: '',
        block_date: '',
        createdAt: '',
        updatedAt: '',
      };
      state.isLogin = false;
    },
    updateNickname: (state, action: PayloadAction<string>) => {
      state.userInfo.nick_name = action.payload;
    },
  },
});

export const { updateAccessToken, deleteAccessToken, getUserInfo, logout, updateNickname } = userSlice.actions;
export const userEmail = (state: RootState) => state.user.userInfo.email;
export const userIsLogin = (state: RootState) => state.user.isLogin;
export const userNickname = (state: RootState) => state.user.userInfo.nick_name;
export const userInformation = (state: RootState) => state.user;
export const userAccessToken = (state: RootState) => state.user.accessToken;

export default userSlice.reducer;
