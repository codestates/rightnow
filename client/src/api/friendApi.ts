import axios from 'axios';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: `http://${ENDPOINT}/friend`,
  params: {},
});

export const friendAPI = {
  list: (email: string) => api.post(`/list/${email}`),
  delete: (user_email: string, friend_email: string) => {},
  search: (email: string) => {},
  reqList: (email: string) => {},
  req: (req_user: string, res_user: string) => {},
  res: (req_user: string, res_user: string, answer: string) => {},
};
