import axios from 'axios';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: `http://${ENDPOINT}/`,
  params: {},
});

export const roomAPI = {
  getRoomInfo: (room_id: string, email: string) =>
    api.post(`room/get`, {
      room_id,
      email,
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
      message_id,
      reporter_email,
    }),
  sendImg: (formData: FormData) =>
    api.post('/message/image', formData, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    }),
};
