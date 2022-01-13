import React, { ChangeEvent, useEffect, useState, KeyboardEvent } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import friendsApi from '../../../api/friendsApi';
import { isValidEmail } from '../../../utils/regex';
import { useAppDispatch, useAppSelector } from '../../../config/hooks';
import { userEmail } from '../../../reducers/userSlice';
import { showAlert } from '../../../reducers/componetSlice';

const Add = () => {
  const dispatch = useAppDispatch();
  // 로그인 유저의 이메일
  const email = useAppSelector(userEmail);
  // 요청 보내는 사람의 이메일
  const [resEmail, setResEmail] = useState<string>('');
  const changeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    setResEmail(e.target.value);
  };

  // 버튼 활성화 비활성화 여부
  const [isDisable, setIsDisable] = useState<boolean>(true);

  // 이메일 형식에 맞을 경우 버튼 활성화
  useEffect((): void => {
    if (isValidEmail(resEmail)) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [resEmail]);

  const requestFriend = () => {
    const body = {
      req_user: email,
      res_user: resEmail,
    };
    const callback = (code: number, data: string) => {
      dispatch(showAlert(data));
    };
    friendsApi('reqFriend', body, callback);
  };

  // 엔터 단축키 관련
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === 'Enter' && !isDisable) {
      requestFriend();
    }
  };

  return (
    <>
      <div className="text-lg font-semibold">친구 추가</div>
      <div className="w-135 mt-6 flex items-center justify-between text-sm relative">
        <div className=" absolute left-2">
          <SearchIcon className=" text-sub" />
        </div>
        <input
          type="text"
          value={resEmail}
          onChange={changeEmail}
          placeholder="이메일을 입력하세요."
          className=" border-1 pl-9 h-10 outline-main w-112 rounded-md"
          onKeyDown={pressEnter}
        />
        <button
          className={`px-4 py-3 rounded-md ${
            isDisable
              ? 'bg-slate-100 text-slate-300'
              : 'bg-main text-white hover:bg-orange-700'
          }`}
          disabled={isDisable}
          onClick={requestFriend}
        >
          친구추가
        </button>
      </div>
    </>
  );
};

export default Add;
