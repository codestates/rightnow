import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";

export interface CompoentState {
    alert: string;
    modal: string;
    url: string;
}

const initialState: CompoentState = {
    alert: "",
    modal: "",
    url: "",
};

export const componetSlice = createSlice({
    name: "component",
    initialState,
    reducers: {
        showAlert: (state, action: PayloadAction<string>) => {
            state.alert = action.payload;
        },
        showModal: (state, action: PayloadAction<string>) => {
            state.modal = action.payload;
        },
        updateUrl: (state, action: PayloadAction<string>) => {
            state.url = action.payload;
        },
    },
});

export const { showAlert, showModal, updateUrl } = componetSlice.actions;
export const alert = (state: RootState) => state.component.alert;
export const modal = (state: RootState) => state.component.modal;
export const url = (state: RootState) => state.component.url;

export default componetSlice.reducer;
