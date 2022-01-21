import React from 'react';
import styled from 'styled-components';
import { BounceBall } from './Spinner';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.4);
  z-index: 10;
  transition: 0.3s;
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  /* margin: 20px auto; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface LoadingProps {
  children: React.ReactNode;
}

const Loading = ({ children }: LoadingProps) => {
  return (
    <>
      <Container>
        <LoadingContainer>
          <BounceBall />
          {children}
        </LoadingContainer>
      </Container>
    </>
  );
};

export default Loading;
