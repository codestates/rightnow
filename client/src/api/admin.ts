import axios from 'axios';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: `http://${ENDPOINT}/admin`,
  params: {},
});

export const adminAPI = {
  getList: (accessToken: string) =>
    api.get('/report/user', {
      headers: {
        Authorization: accessToken,
      },
    }),
  userBlock: () => {},
};
