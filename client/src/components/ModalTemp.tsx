import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.4);
  z-index: 10;
`;

const ModalBody = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 40px;
  text-align: center;
  background-color: rgb(255, 255, 255);
  box-shadow: 7px 7px 0 0 rgba(33, 34, 38, 0.8);
  transform: translateX(-50%) translateY(-50%);
  white-space: pre-line;
  line-height: 1.5rem;
`;

interface ModalProps {
  children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  return (
    <Container>
      <ModalBody>{children}</ModalBody>
    </Container>
  );
};

export default Modal;
