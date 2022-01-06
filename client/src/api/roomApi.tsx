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
  getRoomInfo: () => api.post(`room/get`),
  location: (lon: number, lat: number) =>
    api.get(`participant/location`, {
      params: {
        lon,
        lat,
      },
    }),
};
