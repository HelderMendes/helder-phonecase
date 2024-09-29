'use client';
import PhoneCaseImage from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Rnd } from 'react-rnd';
import HandleComponent from '@/components/HandleComponent';

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

export default function DesignConfigurator({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) {
  return (
    <div className='relative mb-20 mt-20 grid grid-cols-1 pb-20 lg:grid-cols-3'>
      <div className='relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
        <div className='pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50'>
          <AspectRatio
            ratio={896 / 1831}
            className='pointer-events-none relative z-50 aspect-[896/1831] w-full'
          >
            <PhoneCaseImage
              fill
              src='/phone-template.png'
              alt='phone case Image'
              className='pointer-events-none z-50 select-none'
            />
          </AspectRatio>
          <div className='absolute inset-0 bottom-px left-[3px] right-[3px] top-px z-40 rounded-[32px] shadow-[0_0_0_99999px_rgba(230,232,234,0.5)]' />
          <div
            className={cn(
              'absolute inset-0 bottom-px left-[3px] right-[3px] top-px rounded-[32px]',
              `bg-zinc-900`,
            )}
          />
        </div>
        <Rnd
          className='absolute z-20 border-[3px] border-primary'
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 2,
            width: imageDimensions.width / 2,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            topLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
          }}
        >
          <div className='relative h-full w-full'>
            <PhoneCaseImage
              src={imageUrl}
              fill
              alt='Your phone case image'
              className='pointer-events-none'
            />
          </div>
        </Rnd>
      </div>
    </div>
  );
}
