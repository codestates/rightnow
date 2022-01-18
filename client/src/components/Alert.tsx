import React, { useEffect, useState } from 'react';
import { alert, showAlert } from '../reducers/componetSlice';
import { useAppDispatch, useAppSelector } from '../config/hooks';
import { deleteAccessToken } from '../reducers/userSlice';

const Alert = () => {
  const dispatch = useAppDispatch();
  // 알림 창의 타입지정
  const alertType: string = useAppSelector(alert);
  // 제목
  const [title, setTitle] = useState<string>('');
  // 부제목
  const [subTitle, setSubTitle] = useState<string>('');

  useEffect(() => {
    switch (alertType) {
      case 'login':
        setTitle('로그인');
        setSubTitle('로그인 하였습니다');
        break;
      case 'signup':
        setTitle('회원가입');
        setSubTitle('회원가입에 성공 하셨습니다.');
        break;
      case 'tempSignup':
        setTitle('임시 계정 만들기');
        setSubTitle('임시 계정을 만들었습니다.');
        break;
      case 'logout':
        setTitle('로그아웃');
        setSubTitle('로그아웃 하였습니다.');
        break;
      case 'updatePasswordForget':
        setTitle('비밀번호 재설정');
        setSubTitle('비밀번호를 재설정 하였습니다.');
        break;
      case 'updateUserInfo':
        setTitle('프로필 설정');
        setSubTitle('회원정보를 수정 하였습니다.');
        break;
      case 'updateProfile':
        setTitle('프로필 설정');
        setSubTitle('프로필 사진을 수정 하였습니다.');
        break;
      case 'profileTypeError':
        setTitle('프로필 설정');
        setSubTitle('png, jpg, jpeg 형식의 파일만 첨부할 수 있습니다.');
        break;
      case 'updatePasswordKnow':
        setTitle('비밀번호 변경');
        setSubTitle('비밀번호를 변경 하였습니다.');
        break;
      case 'updatePasswordWrongPassword':
        setTitle('비밀번호 변경');
        setSubTitle('현재 비밀번호가 일치하지 않습니다.');
        break;
      case 'signout':
        setTitle('계정삭제');
        setSubTitle('라잇나우 계정을 완전히 삭제하였습니다.');
        break;
      case 'invalidRefreshToken':
        setTitle('토큰만료');
        setSubTitle('토큰이 만료되었습니다. 다시 로그인 해주세요.');
        break;
      case 'temperedToken':
        setTitle('토큰오류');
        setSubTitle('토큰과 일치하는 유저가 없습니다. 다시 로그인 해주세요.');
        break;
      case 'signoutWrongPassword':
        setTitle('계정삭제');
        setSubTitle('현재 비밀번호가 일치하지 않습니다.');
        break;
      case 'alreadyRoomFriend':
        setTitle('모임검색');
        setSubTitle('이미 방에 참가 중인 유저와는 매칭을 시작할 수 없습니다.');
        break;
      case 'alreadyRoomUser':
        setTitle('모임검색');
        setSubTitle(
          '참가 중인 모임이 끝나야 새로운 모임을 찾을 수 있어요.(확인을 누르면 방으로 이동합니다.)',
        );
        break;
      case 'alreadySearchingFriend':
        setTitle('모임검색');
        setSubTitle('매칭 중인 유저와는 매칭을 시작할 수 없습니다.');
        break;
      case 'outOfRange':
        setTitle('모임검색');
        setSubTitle('선택한 친구가 카테고리 제한 인원보다 많습니다.');
        break;
      case 'cannotCancel':
        setTitle('모임검색');
        setSubTitle('매칭 취소는 그룹장만 할 수 있습니다.');
        break;
      case 'blank':
        setTitle('텍스트 입력');
        setSubTitle('공백문자는 사용 할 수 없습니다.');
        break;
      case 'requestFriend':
        setTitle('친구 추가');
        setSubTitle('성공적으로 친구요청을 보냈습니다.');
        break;
      case 'alredyRequest':
        setTitle('친구 추가');
        setSubTitle('이미 친구요청을 보냈습니다.');
        break;
      case 'noExistUser':
        setTitle('친구 추가');
        setSubTitle('이메일이 존재하지 않습니다.');
        break;
      case 'alredyFriend':
        setTitle('친구 추가');
        setSubTitle('이미 친구목록에 있습니다.');
        break;
      case 'friendRequest':
        setTitle('친구 추가');
        setSubTitle('이미 상대가 친구요청을 보냈습니다.');
        break;
      case 'selfRequest':
        setTitle('친구 추가');
        setSubTitle('자기 자신에게는 친구요청을 보낼 수 없습니다.');
        break;
      case 'acceptFriend':
        setTitle('친구 요청');
        setSubTitle('친구 요청을 수락하였습니다.');
        break;
      case 'rejectFriend':
        setTitle('친구 요청');
        setSubTitle('친구 요청을 거절하였습니다.');
        break;
      case 'deleteFriend':
        setTitle('친구 목록');
        setSubTitle('친구를 삭제하였습니다.');
        break;
      case 'accessDenied':
        setTitle('구글 로그인');
        setSubTitle('문제가 발생하였습니다. 다른 경로로 접속하여 주세요.');
        break;
      case 'createCategory':
        setTitle('카테고리');
        setSubTitle('카테고리를 생성하였습니다.');
        break;
      case 'updateCategory':
        setTitle('카테고리');
        setSubTitle('변경사항이 저장 되었습니다.');
        break;
      case 'updateCategoryError':
        setTitle('카테고리');
        setSubTitle('이름과 인원 수를 다시 확인해주세요.');
        break;
      case 'alreadyCreateCategory':
        setTitle('카테고리');
        setSubTitle('이미 생성 된 카테고리입니다.');
        break;
      case 'deleteCategory':
        setTitle('카테고리');
        setSubTitle('카테고리를 삭제하였습니다.');
        break;
    }
  }, [alertType]);

  const closeAlert = (): void => {
    dispatch(showAlert(''));
    // 토큰만료일 경우 확인을 누르면 로그아웃시킴
    if (alertType === 'invalidRefreshToken') {
      dispatch(deleteAccessToken());
    }
  };

  return (
    <>
      <div
        className={`w-full absolute top-0 left-0 bg-opacity-100 flex justify-center items-start ${
          alertType ? 'z-50 opacity-100 h-full' : '-z-10 opacity-0 h-0'
        }`}
        onClick={closeAlert}
      >
        <div
          className={`w-96 h-32 rounded-md bg-white px-6 py-4 relative border-1 shadow-md transition-all ${
            alertType ? 'top-10 opacity-100' : 'top-0 opacity-0'
          }`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="text-lg font-bold">{title}</div>
          <div className="text-sm mt-2 relative top-0">{subTitle}</div>
          <div className="text-right space-x-2 absolute bottom-4 right-6">
            <button
              className={`w-20 h-8 rounded-md bg-main text-white text-sm hover:bg-orange-700`}
              onClick={closeAlert}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;
