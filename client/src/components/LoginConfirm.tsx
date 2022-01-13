import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import ModalTemp from './ModalTemp';

const Modal = styled(ModalTemp)``;

const ConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ConfirmBtn = styled.button`
  background: ${(props) => props.theme.color.main};
  width: 3.4rem;
  height: 1.7rem;
  color: #2d2d2d;
  font-size: 1rem;
  border-radius: 3px;
`;

const ConfrimMessage = styled.div`
  padding-bottom: 0.6rem;
`;

const LoginConfirm = () => {
  const navigate = useNavigate();

  const handleLoginConfirm = () => {
    navigate('/auth/login');
  };

  return (
    <Modal>
      <ConfirmContainer>
        <ConfrimMessage>로그인 후 사용해주세요!</ConfrimMessage>
        <ConfirmBtn
          className="hover:bg-red-500 transition-all"
          onClick={handleLoginConfirm}
        >
          확인
        </ConfirmBtn>
      </ConfirmContainer>
    </Modal>
  );
};

export default LoginConfirm;
