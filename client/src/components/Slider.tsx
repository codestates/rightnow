import React, { useState } from 'react';

interface IImage {
  url: string;
  alt: string;
}

interface IProps {
  images: IImage[];
}

const Slider = ({ images }: IProps) => {
  const [imageIdx, setImageIdx] = useState<number>(0);

  return (
    <div className="w-135 relative overflow-hidden">
      <div
        className="flex relative"
        style={{
          width: 540 * images.length,
          left: -540 * imageIdx,
          transition: 'left 0.8s cubic-bezier(.55,.05,.59,1.35)',
        }}
      >
        {images.map((image, idx) => {
          const { url, alt } = image;
          return (
            <div
              key={idx}
              className="w-135 h-60"
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
              }}
            />
          );
        })}
      </div>
      <div className=" flex justify-center items-center space-x-3 mt-2">
        {images.map((image, idx) => {
          return (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full cursor-pointer bg-main ${imageIdx === idx ? 'bg-main' : 'bg-orange-200 hover:bg-orange-300'}`}
              onClick={() => {
                setImageIdx(idx);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(Slider);
