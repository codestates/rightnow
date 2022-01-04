import axios from 'axios';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
axios.defaults.withCredentials = true;

export default function userApi(
  name: string,
  body?: object,
  callback?: any,
  accessToken?: any,
) {
  switch (name) {
    case 'categoryList':
      axios.get(`http://${ENDPOINT}/category/list`).then((res) => {
        if (res.status === 200) {
          callback(res.status, res.data.data.categoryList);
        }
      });
      break;
    case 'delCategory':
      break;
    case 'createCategory':
      break;
    case 'updateCategory':
      break;
  }
}
