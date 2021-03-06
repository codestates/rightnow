import axios from 'axios';

const endpoint = process.env.REACT_APP_ENDPOINT;
axios.defaults.withCredentials = true;

export default function userApi(
  name: string,
  body?: object,
  callback?: any,
  accessToken?: any,
  email?: string,
) {
  switch (name) {
    // 로그인 요청
    case 'login':
      axios
        .post(`${endpoint}/user/login`, body)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, res.data.data.accessToken);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            callback(err.response.status, '비밀번호를 확인해 주세요.');
          } else if (err.response.status === 400) {
            callback(err.response.status, '등록되지 않는 이메일 입니다.');
          } else if (err.response.status === 404) {
            callback(err.response.status, err.response.data.data.block_date);
          }
        });
      break;
    // 회원가입 이메일인증 요청
    case 'emailAuthSignup':
      axios
        .post(`${endpoint}/user/email/auth`, body)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, res.data.data);
          }
        })
        .catch((err) => {
          if (err.response.status === 409) {
            callback(err.response.status, '등록된 이메일 입니다.');
          }
        });
      break;
    // 비밀번호 찾기 이메일인증 요청
    case 'emailAuthForgetPassword':
      axios
        .post(`${endpoint}/user/email/auth`, body)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, res.data.data);
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            callback(err.response.status, '등록된 이메일 없습니다.');
          }
        });
      break;
    // 회원정보 불러오기 요청
    case 'getUserInfo':
      axios
        .get(`${endpoint}/user/info`, {
          headers: {
            Authorization: accessToken,
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, res.data.data);
          }
        })
        .catch((err) => {
          callback(err.response.status);
        });
      break;
    // 회원가입 요청
    case 'signup':
      axios
        .post(`${endpoint}/user/signup`, body)
        .then((res) => {
          if (res.status === 201) {
            callback(res.status, res.data.data.accessToken);
          }
        })
        .catch((err) => {
          if (err.response.status === 422) {
            callback(err.response.status, '인증번호를 확인해 주세요.');
          } else if (err.response.status === 409) {
            callback(err.response.status, '등록된 이메일 입니다.');
          }
        });
      break;
    // 잊어버린 비밀번호 재설정 요청
    case 'updatePasswordForget':
      axios
        .patch(`${endpoint}/user/update/password`, body)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    // 비밀번호 수정 요청
    case 'updatePasswordKnow':
      axios
        .patch(`${endpoint}/user/update/password`, body)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            callback(err.response.status);
          }
        });
      break;
    // 유저 개인정보 수정
    case 'updateUserInfo':
      axios
        .patch(`${endpoint}/user/update`, body, {
          headers: {
            Authorization: accessToken,
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, res.data.data.userInfo.nick_name);
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            callback(err.response.status, 'refreshToken이 만료되었습니다.');
          } else if (err.response.status === 404) {
            callback(
              err.response.status,
              'token과 일치하는 유저를 찾을 수 없습니다.',
            );
          }
        });
      break;
    case 'signout':
      axios
        .post(`${endpoint}/user/signout`, body)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status);
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            callback(err.response.status);
          }
        });
      break;
    case 'logout':
      axios
        .post(`${endpoint}/user/logout`)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => {
          // console.log(err);
        });
      break;
    case 'kakaoLogin':
      axios
        .post(`${endpoint}/oauth/callback/kakao`, body)
        .then((res) => {
          if (res.status === 200) {
            callback(res.status, res.data.data.accessToken);
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            callback(err.response.status, err.response.data.data.block_date);
          }
        });
      break;
    case 'googleLogin':
      axios
        .post(`${endpoint}/oauth/callback/google`, body)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            callback(err.response.status, err.response.data.data.block_date);
          }
        });
      break;
  }
}
