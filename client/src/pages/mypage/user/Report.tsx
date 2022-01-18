import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../api/admin';
import defaultProfile from '../../../images/profile.png';

interface IData {
  email: string;
  nick_name: string;
  profile_image: string | null;
  role: string;
  social_login: string;
  is_block: string | null;
  block_date: string | null;
  createdAt: string;
  updatedAt: string;
}

interface IUser {
  email: string;
  nick_name: string;
  profile_image: string | null;
  role: string;
  social_login: string;
  block_date: string;
  createdAt: string;
}

const Report = () => {
  // 프로필 이미지 서버 엔드포인트
  const imageEndpoint = process.env.REACT_APP_IMAGE_ENDPOINT;

  // 전체 유저 리스트
  const [allUserList, setAllUserList] = useState<IUser[]>([]);

  // 전체 유저 리시트 불러오기
  const getAllUser = async () => {
    await adminAPI.getUserList().then((res) => {
      const temp_data = res.data.data.userInfo
        .map((obj: IData) => {
          const {
            email,
            nick_name,
            profile_image,
            role,
            social_login,
            createdAt,
            block_date,
          } = obj;
          return {
            email,
            nick_name,
            profile_image,
            role,
            social_login,
            createdAt,
            block_date: block_date === null ? '-' : block_date,
          };
        })
        .filter((val: IUser) => {
          return val.block_date !== '-';
        });
      setAllUserList(temp_data);
    });
  };

  useEffect((): void => {
    getAllUser();
  }, []);

  const [toggleOption, setToggleOption] = useState({
    email: true,
    nick_name: true,
    role: true,
    social_login: true,
    createdAt: true,
    block_date: true,
  });

  return (
    <>
      <div className="text-lg font-semibold pl-1">신고유저 목록</div>
      <div className=" w-160 text-sub mt-2">
        <div className="flex items-center w-full font-semibold text-xs text-center">
          <div className="w-3/12 pl-8">
            <span
              className="cursor-pointer"
              onClick={() => {
                const temp = [...allUserList];
                if (toggleOption.email) {
                  temp.sort((a, b) => {
                    return a.email < b.email ? -1 : a.email > b.email ? 1 : 0;
                  });
                } else {
                  temp.sort((a, b) => {
                    return a.email > b.email ? -1 : a.email < b.email ? 1 : 0;
                  });
                }
                setAllUserList(temp);
                setToggleOption({
                  ...toggleOption,
                  email: !toggleOption.email,
                });
              }}
            >
              이메일
            </span>
          </div>
          <div className="w-2/12">
            <span
              className="cursor-pointer"
              onClick={() => {
                const temp = [...allUserList];
                if (toggleOption.nick_name) {
                  temp.sort((a, b) => {
                    return a.nick_name < b.nick_name
                      ? -1
                      : a.nick_name > b.nick_name
                      ? 1
                      : 0;
                  });
                } else {
                  temp.sort((a, b) => {
                    return a.nick_name > b.nick_name
                      ? -1
                      : a.nick_name < b.nick_name
                      ? 1
                      : 0;
                  });
                }
                setAllUserList(temp);
                setToggleOption({
                  ...toggleOption,
                  nick_name: !toggleOption.nick_name,
                });
              }}
            >
              닉네임
            </span>
          </div>
          <div className="w-1/12">
            <span
              className="cursor-pointer"
              onClick={() => {
                const temp = [...allUserList];
                if (toggleOption.role) {
                  temp.sort((a, b) => {
                    return a.role < b.role ? -1 : a.role > b.role ? 1 : 0;
                  });
                } else {
                  temp.sort((a, b) => {
                    return a.role > b.role ? -1 : a.role < b.role ? 1 : 0;
                  });
                }
                setAllUserList(temp);
                setToggleOption({
                  ...toggleOption,
                  role: !toggleOption.role,
                });
              }}
            >
              역할
            </span>
          </div>
          <div className="w-2/12">
            <span
              className="cursor-pointer"
              onClick={() => {
                const temp = [...allUserList];
                if (toggleOption.social_login) {
                  temp.sort((a, b) => {
                    return a.social_login < b.social_login
                      ? -1
                      : a.social_login > b.social_login
                      ? 1
                      : 0;
                  });
                } else {
                  temp.sort((a, b) => {
                    return a.social_login > b.social_login
                      ? -1
                      : a.social_login < b.social_login
                      ? 1
                      : 0;
                  });
                }
                setAllUserList(temp);
                setToggleOption({
                  ...toggleOption,
                  social_login: !toggleOption.social_login,
                });
              }}
            >
              소셜 로그인
            </span>
          </div>
          <div className="w-2/12">
            <span
              className="cursor-pointer"
              onClick={() => {
                const temp = [...allUserList];
                if (toggleOption.createdAt) {
                  temp.sort((a, b) => {
                    return a.createdAt < b.createdAt
                      ? -1
                      : a.createdAt > b.createdAt
                      ? 1
                      : 0;
                  });
                } else {
                  temp.sort((a, b) => {
                    return a.createdAt > b.createdAt
                      ? -1
                      : a.createdAt < b.createdAt
                      ? 1
                      : 0;
                  });
                }
                setAllUserList(temp);
                setToggleOption({
                  ...toggleOption,
                  createdAt: !toggleOption.createdAt,
                });
              }}
            >
              생성날짜
            </span>
          </div>
          <div className="w-2/12">
            <span
              className="cursor-pointer"
              onClick={() => {
                const temp = [...allUserList];
                if (toggleOption.block_date) {
                  temp.sort((a, b) => {
                    return a.block_date < b.block_date
                      ? -1
                      : a.block_date > b.block_date
                      ? 1
                      : 0;
                  });
                } else {
                  temp.sort((a, b) => {
                    return a.block_date > b.block_date
                      ? -1
                      : a.block_date < b.block_date
                      ? 1
                      : 0;
                  });
                }
                setAllUserList(temp);
                setToggleOption({
                  ...toggleOption,
                  block_date: !toggleOption.block_date,
                });
              }}
            >
              정지날짜
            </span>
          </div>
        </div>
        {allUserList.map((obj) => {
          const {
            email,
            nick_name,
            profile_image,
            role,
            social_login,
            createdAt,
            block_date,
          } = obj;
          return (
            <div
              className="flex items-center w-full text-xs relative py-2 text-center"
              key={email}
            >
              <div
                className={'h-7 w-7 rounded-full absolute left-0'}
                style={{
                  backgroundImage: `url(${
                    profile_image === null
                      ? defaultProfile
                      : profile_image.indexOf('kakaocdn') !== -1 ||
                        profile_image.indexOf('googleusercontent') !== -1
                      ? profile_image
                      : imageEndpoint + profile_image
                  })`,
                  backgroundSize: 'cover',
                }}
              />
              <div className="w-3/12 pl-9 overflow-hidden text-ellipsis whitespace-nowrap">
                {email}
              </div>
              <div className="w-2/12">{nick_name}</div>
              <div className="w-1/12">
                {role === 'ADMIN'
                  ? '관리자'
                  : role === 'USER'
                  ? '회원'
                  : '임시회원'}
              </div>
              <div className="w-2/12">
                {social_login === 'kakao'
                  ? '카카오'
                  : social_login === 'google'
                  ? '구글'
                  : '-'}
              </div>
              <div className="w-2/12">{createdAt}</div>
              <div className="w-2/12">{block_date}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Report;
