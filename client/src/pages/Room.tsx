import React, { useState } from 'react';
import styled from 'styled-components';
import Group from '../components/Group';

const Container = styled.div`
  height: 100vh;
  padding-top: 62px;
`;

const GroupContainer = styled.div`
  position: fixed;
  left: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0.5rem;
  width: 6.1rem;
  transition: all 0.2s ease-in;
  width: 6rem;
  &:hover {
    width: 24rem;
  }
`;

const Room = () => {
  const [isHover, setIsHover] = useState<boolean>(false);

  const handleMouseOver = () => {
    setIsHover(!isHover);
  };

  return (
    <Container className="bg-green-200">
      <GroupContainer
        className="bg-blue-400"
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOver}
      >
        <Group hover={isHover} />
        <Group hover={isHover} />
        <Group hover={isHover} />
        <Group hover={isHover} />
        <Group hover={isHover} />
      </GroupContainer>
    </Container>
  );
};

export default Room;
