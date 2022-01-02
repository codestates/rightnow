import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";

export interface UserState {
    nickname: string;
    email: string;
    isLogin: boolean;
    accessToken: string;
}

const initialState: UserState = {
    nickname: "",
    email: "",
    isLogin: false,
    accessToken: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        changeEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        changeLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        },
    },
});

export const { changeEmail, changeLogin } = userSlice.actions;
export const email = (state: RootState) => state.user.email;
export const login = (state: RootState) => state.user.isLogin;
export const userInfo = (state: RootState) => state.user

export default userSlice.reducer;
