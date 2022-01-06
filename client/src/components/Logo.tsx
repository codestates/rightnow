import React from 'react';
import logo from '../images/rightnow_logo.png';

interface IProps {
  width?: number;
}

const Logo = ({ width }: IProps) => {
  const logoWidth = width ? width : 90;
  return (
    <>
      <img className='transition-all' src={logo} alt="rightnow logo" width={logoWidth} />
    </>
  );
};

export default Logo;
