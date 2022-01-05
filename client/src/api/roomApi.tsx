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
    case 'createRoom':
      break;
    case 'deleteRoom':
      break;
    case 'updateRoom':
      break;
    case 'getRoomInfo':
      axios.post(`${ENDPOINT}/room/get`).then((res) => {
        if (res.status === 200) {
          callback(res.status);
        }
      });
      break;
  }
}
