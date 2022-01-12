import axios from 'axios';

const endpoint = process.env.REACT_APP_ENDPOINT;
const url = `http://${endpoint}/friend`;
axios.defaults.withCredentials = true;

export default function friendsApi(
  name: string,
  body?: object,
  callback?: any,
  email?: string,
) {
  switch (name) {
    // 친구 요청
    case 'reqFriend':
      axios
        .post(`${url}/request`, body)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, 'requestFriend');
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            callback(err.response.status, 'alredyRequest');
          } else if (err.response.status === 404) {
            callback(err.response.status, 'noExistUser');
          } else if (err.response.status === 409) {
            if (
              err.response.data.message === 'you already exists friend List'
            ) {
              callback(err.response.status, 'alredyFriend');
            } else if (
              err.response.data.message ===
              'you already recieved friend request'
            ) {
              callback(err.response.status, 'friendRequest');
            } else if (
              err.response.data.message === 'dont have to request yourself'
            ) {
              callback(err.response.status, 'selfRequest');
            }
          }
        });
      break;
    // 친구 요청을 보낸 사람들 목록조회
    case 'getFriendRequestList':
      axios
        .post(`${url}/request/list/${email}`)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, res.data.data.RequestFriendList);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    // 친구 요청
    case 'resFriend':
      axios
        .post(`${url}/response`, body)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.message === 'ok, accepted') {
              callback(res.status, 'acceptFriend');
            } else if (res.data.message === 'ok, rejected') {
              callback(res.status, 'rejectFriend');
            }
          }
        })
        .catch((err) => {
          console.log(err);
          callback();
        });
      break;
    // 친구 목록조회
    case 'getFriendList':
      axios
        .post(`${url}/list/${email}`)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, res.data.data.FriendList);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    // 친구 삭제
    case 'deleteFriend':
      axios
        .delete('http://localhost/friend', {
          data: body,
        })
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, 'deleteFriend');
          }
        })
        .catch((err) => {
          console.log(err);
        });
      break;
  }
}
