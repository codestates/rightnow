import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";

export interface CompoentState {
    alert: string;
    modal: string
}

const initialState: CompoentState = {
    alert: "",
    modal: "",
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
    },
});

export const { showAlert, showModal } = componetSlice.actions;
export const alert = (state: RootState) => state.component.alert;
export const modal = (state: RootState) => state.component.modal;

export default componetSlice.reducer;
