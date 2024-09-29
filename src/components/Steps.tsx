/* eslint-disable @next/next/no-img-element */
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    name: 'Step 1: Add image',
    description: 'Choose an image for your phone case',
    url: '/upload',
  },
  {
    name: 'Step 2: Customize design',
    description: 'Make the phone case yours',
    url: '/design',
  },
  {
    name: 'Step 2: Summary',
    description: 'Review your final design',
    url: '/preview',
  },
];

function Steps() {
  const pathname = usePathname();

  return (
    <ol className='rounded-md bg-white lg:flex lg:rounded-none lg:border-x lg:border-gray-200'>
      {STEPS.map((step, stepIndex) => {
        const isCurrent = pathname.endsWith(step.url);
        const isCompleted = STEPS.slice(stepIndex + 1).some((step) =>
          pathname.endsWith(step.url),
        );
        const imgPath = `/snake-${stepIndex + 1}.png`;

        return (
          <li key={stepIndex} className='relative overflow-hidden lg:flex-1'>
            <div>
              <span
                className={cn(
                  'absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full',
                  {
                    'bg-zinc-700': isCurrent,
                    'bg-primary': isCompleted,
                  },
                )}
                aria-hidden='true'
              />
              <span
                className={cn(
                  'flex items-center px-6 py-4 text-sm font-medium',
                  {},
                )}
              >
                <span className='flex-shrink-0'>
                  <img
                    src={imgPath}
                    alt=''
                    className={cn(
                      'flex h-20 w-20 items-center justify-center object-contain',
                      {
                        'border-none': isCompleted,
                        'border-zinc-700': isCurrent,
                      },
                    )}
                  />
                </span>
                <span className='ml-4 mt-0.5 flex h-full min-w-0 flex-col justify-center'>
                  <span
                    className={cn('text-sm font-semibold text-zinc-700', {
                      'text-primary': isCompleted,
                      'text-zinc-700': isCurrent,
                    })}
                  >
                    {step.name}
                  </span>
                  <span className='text-zin-500 text-sm'>
                    {step.description}{' '}
                  </span>
                </span>
              </span>

              {stepIndex !== 0 ? (
                <div className='hidde absolute inset-0 w-3 lg:block'>
                  <svg
                    className='h-full w-full text-gray-300'
                    viewBox='0 0 12 82'
                    fill='none'
                    preserveAspectRatio='none'
                  >
                    <path
                      d='M0.5 0V31L10.5 41L0.5 51V82'
                      stroke='currentcolor'
                      vectorEffect='non-scaling-stroke'
                    />
                  </svg>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default Steps;
