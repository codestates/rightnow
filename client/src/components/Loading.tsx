import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255, 0.3);
  z-index: 10;
  transition: 0.3s;
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const Loading = () => {
  return (
    <Container>
      <Content>Loading</Content>
    </Container>
  );
};

export default Loading;
