import axios from 'axios';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: `${ENDPOINT}/admin`,
  params: {},
});

export const adminAPI = {
  getList: () => api.get('/report/user'),
  userBlock: (block_email: string, block_day: string) =>
    api.post('/block/user', {
      block_email,
      block_day,
    }),
  getUserList: () => api.get('/user'),
};
