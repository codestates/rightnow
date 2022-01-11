import React, { ChangeEvent, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';

const Add = () => {
  const [email, setEmail] = useState<string>('');
  const changeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  return (
    <>
      <div className="text-lg font-semibold">친구 추가</div>
      <div className="w-135 mt-6 flex items-center justify-between text-sm relative">
        <div className=" absolute left-2">
          <SearchIcon className=' text-sub'/>
        </div>
        <input
          type="text"
          value={email}
          onChange={changeEmail}
          placeholder="이메일을 입력하세요."
          className=" border-1 pl-9 h-10 outline-main w-112 rounded-md"
        />
        <div className="px-4 py-2 bg-main text-white rounded-md cursor-pointer hover:bg-orange-700">
          친구추가
        </div>
      </div>
    </>
  );
};

export default Add;
