import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../config/store';

export interface RoomState {
  location: string;
  lon: number;
  lat: number;
  category: string;
}

const initialState: RoomState = {
  location: '',
  lon: -1,
  lat: -1,
  category: '',
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setLon: (state, action: PayloadAction<number>) => {
      state.lon = action.payload;
    },
    setLat: (state, action: PayloadAction<number>) => {
      state.lat = action.payload;
    },
    setRoomCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
  },
});

export const { setLocation, setLon, setLat, setRoomCategory } =
  roomSlice.actions;
export const roomLocation = (state: RootState) => state.room.location;
export const roomLon = (state: RootState) => state.room.lon;
export const roomLat = (state: RootState) => state.room.lat;
export const roomCategory = (state: RootState) => state.room.category;

export default roomSlice.reducer;
