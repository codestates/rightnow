import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../config/store';

interface IRequestFriend {
  list: string[];
  count: number;
}

export interface IUserInfo {
  email: string;
  nick_name: string;
  profile_image: string | null;
  role: string;
  is_block: string;
  block_date: string;
  createdAt: string;
  updatedAt: string;
  social_login: string;
  auth_code: string;
}

export interface UserState {
  userInfo: IUserInfo;
  isLogin: boolean;
  accessToken: string;
  requestFriend: IRequestFriend;
}

const initialState: UserState = {
  userInfo: {
    email: '',
    nick_name: '',
    profile_image: null,
    role: '',
    is_block: '',
    block_date: '',
    createdAt: '',
    updatedAt: '',
    social_login: '',
    auth_code: '',
  },
  isLogin: false,
  accessToken: '',
  requestFriend: {
    list: [],
    count: 0,
  },
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
        profile_image: null,
        role: '',
        is_block: '',
        block_date: '',
        createdAt: '',
        updatedAt: '',
        social_login: '',
        auth_code: '',
      };
      state.isLogin = false;
    },
    updateNickname: (state, action: PayloadAction<string>) => {
      state.userInfo.nick_name = action.payload;
    },
    updateProfile: (state, action: PayloadAction<string>) => {
      state.userInfo.profile_image = action.payload;
    },
    updateRequestFriendList: (state, action: PayloadAction<string[]>) => {
      state.requestFriend.list = action.payload;
    },
    updateRequestFriendCount: (state, action: PayloadAction<number>) => {
      state.requestFriend.count = action.payload;
    },
  },
});

export const {
  updateAccessToken,
  deleteAccessToken,
  getUserInfo,
  logout,
  updateNickname,
  updateProfile,
  updateRequestFriendList,
  updateRequestFriendCount,
} = userSlice.actions;
export const userEmail = (state: RootState) => state.user.userInfo.email;
export const userIsLogin = (state: RootState) => state.user.isLogin;
export const userNickname = (state: RootState) => state.user.userInfo.nick_name;
export const userProfile = (state: RootState) =>
  state.user.userInfo.profile_image;
export const userInformation = (state: RootState) => state.user.userInfo;
export const userAccessToken = (state: RootState) => state.user.accessToken;
export const userRole = (state: RootState) => state.user.userInfo.role;
export const userSocialLogin = (state: RootState) =>
  state.user.userInfo.social_login;
export const userRequestFriendList = (state: RootState) =>
  state.user.requestFriend.list;
export const userRequestFriendCount = (state: RootState) =>
  state.user.requestFriend.count;

export default userSlice.reducer;
