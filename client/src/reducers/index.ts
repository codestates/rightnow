import { combineReducers } from 'redux';
import userSlice from './userSlice';
import componetSlice from './componetSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import roomSlice from './roomSlice';

const appReducer = combineReducers({
  user: userSlice,
  component: componetSlice,
  room: roomSlice,
});

const rootReducer = (state: any, action: PayloadAction<any>) => {
  return appReducer(state, action);
};

export default rootReducer;
