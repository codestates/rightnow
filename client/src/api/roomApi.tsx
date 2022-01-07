import axios from 'axios';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: `http://${ENDPOINT}/`,
  params: {},
});

export const roomAPI = {
  createRoom: () => {},
  deleteRoom: () => {},
  updateRoom: () => {},
  getRoomInfo: (room_id: string) =>
    api.post(`room/get`, {
      room_id,
    }),
  location: (lon: number, lat: number) =>
    api.get(`participant/location`, {
      params: {
        lon,
        lat,
      },
    }),
  report: (message_id: number, reporter_email: string) =>
    api.post(`user/report`, {
      data: { message_id, reporter_email },
    }),
};
