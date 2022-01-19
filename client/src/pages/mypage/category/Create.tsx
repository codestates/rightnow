import React, { useEffect, useState, KeyboardEvent, useRef } from 'react';
import { categoryAPI } from '../../../api/categoryApi';
import { useAppDispatch, useAppSelector } from '../../../config/hooks';
import { alert, showAlert } from '../../../reducers/componetSlice';
import { isNumber } from '../../../utils/regex';

const Create = () => {
  const dispatch = useAppDispatch();
  // 알림 창 존재 유무
  const isExistAlert = useAppSelector(alert);
  // ref
  const nameRef = useRef<HTMLInputElement>(null);
  const user_numRef = useRef<HTMLInputElement>(null);
  // 카테고리 이름
  const [name, setName] = useState<string>('');
  // 카테고리 인원 수
  const [user_num, setUser_num] = useState<string>('');
  // 생성 버튼 활성화 유무
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  useEffect(() => {
    if (name === '' || Number(user_num) === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [name, user_num]);

  // 카테고리 생성
  const createCategory = async () => {
    await categoryAPI
      .create(name, Number(user_num))
      .then((res) => {
        dispatch(showAlert('createCategory'));
        setName('');
        setUser_num('');
        nameRef.current?.focus();
      })
      .catch((err) => {
        if (err.response.status === 409) {
          dispatch(showAlert('alreadyCreateCategory'));
          nameRef.current?.focus();
        }
      });
  };

  // 엔터 단축키 관련
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    if (target.id === 'name' && e.code === 'Enter' && isExistAlert === "" && name !== "") {
      user_numRef.current?.focus();
    } else if (target.id === 'user_num' && e.code === 'Enter' && !isDisabled) {
      createCategory();
    }
  };

  return (
    <>
      <div className="text-lg font-semibold pl-1">카테고리 생성</div>
      <div className=" w-160 text-sm text-sub mt-2">
        <div className="mt-2">
          <input
            type="text"
            id="name"
            className="w-96 border-2 border-slate-300 h-12 rounded-md pl-2 outline-main"
            placeholder="이름을 입력해주세요."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyPress={pressEnter}
            ref={nameRef}
          />
        </div>
        <div className="mt-2">
          <input
            type="text"
            id="user_num"
            className="w-96 border-2 border-slate-300 h-12 rounded-md pl-2 outline-main"
            placeholder="인원 수 입력해주세요."
            value={user_num}
            onChange={(e) => {
              if (isNumber(e.target.value)) {
                setUser_num(e.target.value);
              }
            }}
            onKeyPress={pressEnter}
            ref={user_numRef}
          />
        </div>
        <div className="mt-2 w-96 text-right">
          <button
            className={`w-full h-12  border-1 rounded-md ${
              isDisabled
                ? 'bg-slate-100 border-slate-100 text-slate-300'
                : 'bg-main border-main text-white hover:bg-orange-700'
            }`}
            disabled={isDisabled}
            onClick={createCategory}
          >
            생성
          </button>
        </div>
      </div>
    </>
  );
};

export default Create;
