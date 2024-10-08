import React from 'react';

interface RotateHandlerProps {
  rotation: number;
  setRotation: (rotation: number) => void;
}

const RotateHandler: React.FC<RotateHandlerProps> = ({
  rotation,
  setRotation,
}) => {
  return (
    <div className='col-span-2 mt-4'>
      <label className='text-semibold pr-4' htmlFor='rotation'>
        Drag the handler to chose image rotation{' '}
      </label>
      <input
        className='h-4 w-64 cursor-pointer appearance-none rounded-lg bg-gray-200' // Full width and height styling
        id='rotation'
        type='range'
        min='0'
        max='360'
        value={rotation}
        onChange={(e) => setRotation(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, rgb(109, 40, 217) 0%, rgb(109, 40, 217) ${
            (rotation / 360) * 100
          }%, #e5e7eb ${(rotation / 360) * 100}%, #e5e7eb 100%)`, // Dynamic background fill
        }}
      />
    </div>
  );
};

export default RotateHandler;
