import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../config/store';

export interface CompoentState {
  alert: string;
  modal: string;
  mypageMenu: boolean;
  url: string;
}

const initialState: CompoentState = {
  alert: '',
  modal: '',
  mypageMenu: false,
  url: '',
};

export const componetSlice = createSlice({
  name: 'component',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<string>) => {
      state.alert = action.payload;
    },
    showModal: (state, action: PayloadAction<string>) => {
      state.modal = action.payload;
    },
    showMypage: (state, action: PayloadAction<boolean>) => {
      state.mypageMenu = action.payload;
    },
    updateUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
  },
});

export const { showAlert, showModal, showMypage, updateUrl } = componetSlice.actions;
export const alert = (state: RootState) => state.component.alert;
export const modal = (state: RootState) => state.component.modal;
export const mypageMenu = (state: RootState) => state.component.mypageMenu;
export const url = (state: RootState) => state.component.url;

export default componetSlice.reducer;
