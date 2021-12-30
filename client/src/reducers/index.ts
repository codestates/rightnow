import { combineReducers } from "redux";
import userSlice from "./userSlice";
import { PayloadAction } from "@reduxjs/toolkit";

const appReducer = combineReducers({
    user: userSlice,
});

const rootReducer = (state: any, action: PayloadAction<any>) => {
    return appReducer(state, action);
};

export default rootReducer;
