/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}
export default function Phone({
  imgSrc,
  dark = false,
  className,
  ...props
}: PhoneProps) {
  return (
    <div
      className={cn(
        'pointer-events-none relative z-50 overflow-hidden',
        className,
      )}
      {...props}
    >
      <img
        src={
          dark
            ? '/phone-template-dark-edges.png'
            : '/phone-template-white-edges.png'
        }
        className='pointer-events-none z-50 select-none'
        alt='phone image'
      />

      <div className='absolute inset-0 -z-10'>
        <img
          src={imgSrc}
          alt='overlaying phone for case cover image'
          className='min-h-full min-w-full object-cover'
        />
      </div>
    </div>
  );
}
