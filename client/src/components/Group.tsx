import React from 'react';
import styled from 'styled-components';

interface IGroup {
  hover: boolean;
}

const Container = styled.div`
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  height: 5rem;
  overflow: hidden;
`;

const Image = styled.div`
  /* rounded-full w-14 h-14 m-2 */
  width: 4rem;
  height: 4rem;
  border-radius: 2rem;
  margin: 0.5rem;

  display: inline-block;
`;

const Title = styled.div<IGroup>`
  display: inline-block;
  position: relative;
  opacity: ${(props) => (props.hover ? '1' : '0')};
  top: 1rem;

  & {
    transition-delay: 0.3s;
    transition: opacity 0.3s ease-in;
  }
`;

interface GroupProps {
  hover: boolean;
}

const Group = ({ hover }: GroupProps) => {
  return (
    <Container className=''>
      <Image className='bg-orange-400 '>이미지</Image>
      <Title className='bg-red-400' hover={hover}>
        모임 이름
      </Title>
    </Container>
  );
};

export default Group;
