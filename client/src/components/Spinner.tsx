import React from 'react';
import styled, { keyframes } from 'styled-components';

const folding = keyframes`
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  } 25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  } 90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
`;

const Block = styled.div`
  float: left;
  width: 50%;
  height: 50%;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.color.sub.brown};
    -webkit-animation: ${folding} 2.4s infinite linear both;
    animation: ${folding} 2.4s infinite linear both;
    -webkit-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
  }
`;

const FoldContainer = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
  -webkit-transform: rotateZ(45deg);
  transform: rotateZ(45deg);
`;

const Block1 = styled(Block)`
  -webkit-transform: scale(1);
  transform: scale(1);
`;

const Block2 = styled(Block)`
  -webkit-transform: scale(1) rotateZ(90deg);
  transform: scale(1) rotateZ(90deg);
  &:before {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
`;

const Block3 = styled(Block)`
  -webkit-transform: scale(1) rotateZ(180deg);
  transform: scale(1) rotateZ(180deg);
  &:before {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
`;

const Block4 = styled(Block)`
  -webkit-transform: scale(1) rotateZ(270deg);
  transform: scale(1) rotateZ(270deg);
  &:before {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }
`;

const Folding = () => {
  return (
    <FoldContainer>
      <Block1></Block1>
      <Block2></Block2>
      <Block4></Block4>
      <Block3></Block3>
    </FoldContainer>
  );
};

const bouncedelay = keyframes`
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
`;

const BounceContainer = styled.div`
  width: 100px;
  margin: 100 auto 0;
  text-align: center;
`;

const Bounce = styled.div`
  width: 20px;
  height: 20px;
  background: white;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: ${bouncedelay} 1.2s infinite ease-in-out both;
  animation: ${bouncedelay} 1.2s infinite ease-in-out both;
`;

const Bounce1 = styled(Bounce)`
  -webkit-animation-delay: -0.45s;
  animation-delay: -0.45s;
`;
const Bounce2 = styled(Bounce)`
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
`;
const Bounce3 = styled(Bounce)`
  -webkit-animation-delay: -0.15s;
  animation-delay: -0.15s;
`;

const Bounce4 = styled(Bounce)``;

const BounceBall = () => {
  return (
    <BounceContainer>
      <Bounce1></Bounce1>
      <Bounce2></Bounce2>
      <Bounce3></Bounce3>
      <Bounce4></Bounce4>
    </BounceContainer>
  );
};

export { Folding, BounceBall };
