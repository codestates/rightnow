import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../config/hooks';
import { showModal } from '../../../reducers/componetSlice';
import Modal from '../../../components/Modal';

const DeleteAccount = () => {
  const dispatch = useAppDispatch();
  // 비밀번호 입력
  const [password, setPassword] = useState<string>('');
  const stateHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  // 계정 삭제버튼 활성화
  const [isDisable, setIsDisable] = useState<boolean>(true);

  useEffect((): void => {
    if (password === '') {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [password]);

  // 계정 삭제버튼 클릭시 모달 활성화
  const buttonHandler = (): void => {
    dispatch(showModal('signout'));
  };

  return (
    <>
      <p className="text-lg font-semibold">계정 삭제</p>
      <div className="text-center mt-5 text-sm">
        <p className="text-2xl">라잇나우 탈퇴 전 꼭 확인해 주세요!</p>
        <p className="mt-2">
          라잇나우계정을 탈퇴하면 계정 정보 및 폼 베이커리 서비스 이용기록 등
          모든 정보가 삭제됩니다.
        </p>
        <p>
          탈퇴 된 라이낫우 계정으로는 로그인 할 수 없으므로 서비스 이용을 할 수
          없게 됩니다.
        </p>
        <p>
          탈퇴 된 라잇나우 정보와 서비스 이용기록 등은 복구할 수 없으니 신중하게
          선택해주시기 바랍니다.
        </p>
      </div>
      <div className="border-t-2 border-slate-200 mt-5" />
      <div className="text-center mt-3">
        <input
          className="border-2 w-80 border-slate-200 h-10 rounded-md pl-2 outline-main mr-2 text-sm"
          type={'password'}
          value={password}
          onChange={(e) => {
            stateHandler(e);
          }}
          placeholder="계정삭제를 위해 비밀번호를 입력해주세요."
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              buttonHandler();
            }
          }}
        />
        <button
          className={`w-36 h-10 rounded-md ${
            isDisable ? 'bg-slate-100 text-slate-300' : 'bg-main text-white hover:bg-pink-700'
          }`}
          disabled={isDisable}
          onClick={buttonHandler}
        >
          계정 삭제
        </button>
      </div>
      <Modal password={password} />
    </>
  );
};

export default DeleteAccount;
