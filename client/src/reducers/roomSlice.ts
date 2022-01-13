import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../config/store';

export interface RoomState {
  location: string;
  lon: number;
  lat: number;
  category: string;
  joinCnt: number;
  maxCnt: number;
  participant: Array<any>;
}

const initialState: RoomState = {
  location: '',
  lon: -1,
  lat: -1,
  category: '',
  joinCnt: 0,
  maxCnt: 0,
  participant: [],
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
    setJoinCnt: (state, action: PayloadAction<number>) => {
      state.joinCnt = action.payload;
    },
    setMaxCnt: (state, action: PayloadAction<number>) => {
      state.maxCnt = action.payload;
    },
    setParticipant: (state, action: PayloadAction<any>) => {
      state.participant = action.payload;
    },
  },
});

export const {
  setLocation,
  setLon,
  setLat,
  setRoomCategory,
  setJoinCnt,
  setMaxCnt,
  setParticipant,
} = roomSlice.actions;
export const roomLocation = (state: RootState) => state.room.location;
export const roomLon = (state: RootState) => state.room.lon;
export const roomLat = (state: RootState) => state.room.lat;
export const roomCategory = (state: RootState) => state.room.category;
export const roomJoinCnt = (state: RootState) => state.room.joinCnt;
export const roomMaxCnt = (state: RootState) => state.room.maxCnt;
export const roomParticipant = (state: RootState) => state.room.participant;

export default roomSlice.reducer;
