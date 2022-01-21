import React, { useEffect } from 'react';

const Policy = () => {
  useEffect(() => {
    window.open(
      'https://rightnow-privacy-policy.vercel.app/rightnow.html',
      '_self',
    );
  }, []);
  return <div></div>;
};

export default Policy;
