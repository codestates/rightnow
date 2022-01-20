import React, { useEffect, useLayoutEffect, useState } from 'react';
import { adminAPI } from '../../../api/admin';
import defaultProfile from '../../../images/profile.png';
import { IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpIcon from '@material-ui/icons/Help';
import { useAppDispatch } from '../../../config/hooks';
import { showAlert } from '../../../reducers/componetSlice';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IReporter {
  reporter: string;
  date: string;
  complete: string;
}

interface IReport {
  message: string;
  complete: string;
  Report_messages: IReporter[];
}

interface IData {
  email: string;
  profile_image: string | null;
  is_block: string;
  block_date: string | null;
  Messages: IReport[];
}

const User = () => {
  const dispatch = useAppDispatch();
  // 프로필 이미지 서버 엔드포인트
  const imageEndpoint = process.env.REACT_APP_IMAGE_ENDPOINT;
  // 로딩 중 유무
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 정지 기간
  const block_date_option = ['3', '7', '14', '30', '영구정지'];

  // 신고목록
  const [reportList, setReportList] = useState<IData[]>([]);
  const getReportList = async () => {
    await adminAPI
      .getList()
      .then((res) => {
        setReportList(res.data.data.reportedUserInfo);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      })
      .catch((err) => {
        console.log(err.response);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };
  useLayoutEffect((): void => {
    getReportList();
  }, []);

  // 선택한 더 보기 인덱스
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // 배경 클릭 했을 때 더 보기 닫기
  document.body.addEventListener('click', () => {
    setSelectedIndex(-1);
  });

  // user block
  const blockUser = async (date: string, email: string) => {
    await adminAPI
      .userBlock(email, date)
      .then((res) => {
        dispatch(showAlert('blockUser'));
        setTimeout(() => {
          getReportList();
        }, 50);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          dispatch(showAlert('already blocked'));
        }
      });
  };

  // help 메세지 보임 유무
  const [isVisibleHelp, setIsVisibleHelp] = useState<boolean>(false);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <CircularProgress color="secondary" />
        </div>
      ) : reportList.length === 0 ? (
        <div className="font-semibold text-sub">신고 된 유저가 없습니다.</div>
      ) : (
        <div className="w-215 text-xs text-sub pb-18">
          <div className="flex items-center fixed w-215 z-20 bg-white font-semibold pt-5 -mt-5 pb-1">
            <div className="w-1/5 pl-10">이메일</div>
            <div className="w-1/5">정지상태(~까지 정지)</div>
            <div className="w-1/5 flex items-center relative">
              <div>메세지</div>
              <div
                className="ml-1 flex items-center justify-center cursor-help relative"
                onMouseOver={() => {
                  setIsVisibleHelp(true);
                }}
                onMouseLeave={() => {
                  setIsVisibleHelp(false);
                }}
              >
                <HelpIcon style={{ fontSize: 20 }} />
              </div>
              <div
                className={`absolute left-18 top-0 w-64 p-2 rounded-md shadow-md border-1 text-xs font-normal bg-white ${
                  isVisibleHelp ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="text-blue-600 font-semibold">파란색</span>{' '}
                메세지는 처리가 된 메세지,{' '}
                <span className="text-main font-semibold">빨간색</span> 메세지는
                처리가 되지 않은 메세지 입니다. 신고 된 유저를 제재하면 현재
                존재하는 비처리 건은 모두 처리 된 메세지로 바뀝니다.
              </div>
            </div>
            <div className="w-1/5">신고자</div>
            <div className="w-1/5">신고일</div>
          </div>
          <div className="relative top-7">
            {reportList.map((obj, index) => {
              const { email, profile_image, block_date, Messages } = obj;
              return (
                <div
                  className={`flex items-center w-full relative py-2 ${
                    index !== reportList.length - 1 && 'border-b-1'
                  }`}
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
                  <div className="w-1/5 pl-10 overflow-hidden text-ellipsis whitespace-nowrap">
                    {email}
                  </div>
                  <div className="w-1/5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {block_date === null
                      ? '사용 중'
                      : Number(block_date.split('-')[0]) > 2200
                      ? '영구 정지'
                      : block_date}
                  </div>
                  <div className="w-3/5 pr-10">
                    {Messages.map((val, idx) => {
                      const { message, complete, Report_messages } = val;
                      return (
                        <div
                          key={idx}
                          className={`w-full flex items-center py-1 ${
                            idx !== Messages.length - 1 && 'border-b-1'
                          }`}
                        >
                          <div
                            className={`w-1/3 break-words ${
                              complete === 'Y' ? 'text-blue-600' : 'text-main'
                            }`}
                          >
                            {message}
                          </div>
                          <div className="w-2/3">
                            {Report_messages.map((v, i) => {
                              const { reporter, date } = v;
                              return (
                                <div className="w-full flex item-center">
                                  <div className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {reporter}
                                  </div>
                                  <div className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {date}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={'h-7 w-7 rounded-full absolute right-0'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(index);
                    }}
                  >
                    <div className="relative">
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                      {selectedIndex === index && (
                        <div
                          className=" bg-white absolute right-8 -top-19 z-40 w-32 py-2 border-1 rounded-md text-xs text-slate-500 shadow-md"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {block_date_option.map((v) => {
                            return (
                              <p
                                key={v}
                                className="hover:bg-gray-100 cursor-pointer px-2 py-2"
                                onClick={() => {
                                  blockUser(v, email);
                                  setSelectedIndex(-1);
                                }}
                              >
                                {v === '영구정지' ? '영구 정지' : `${v}일 정지`}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default User;
