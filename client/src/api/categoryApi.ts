import axios from 'axios';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: `${ENDPOINT}/category`,
});

export const categoryAPI = {
  list: () => api.get(`/list`),
  delete: (category_name: string) =>
    api.delete(`/`, { data: { category_name } }),
  create: (name: string, user_num: number) =>
    api.post(`/create`, { name, user_num }),
  update: (
    category_name: string,
    new_category_name: string,
    new_user_num: number,
  ) => api.patch(`/update`, { category_name, new_category_name, new_user_num }),
};
