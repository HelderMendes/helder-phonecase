'use client';
import PhoneCaseImage from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Rnd } from 'react-rnd';
import HandleComponent from '@/components/HandleComponent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, Radio } from '@headlessui/react';
import { useState } from 'react';
import {
  COLORS,
  MODELS,
  MATERIALS,
  FINISHES,
} from '@/validators/option-validator';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, RotateCw, RotateCcw } from 'lucide-react';

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
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  // State to manage rotation
  const [rotation, setRotation] = useState(0);

  // Handler to rotate clockwise
  const rotateClockwise = () => setRotation((prev) => (prev + 15) % 360);
  // Handler to rotate counterclockwise
  const rotateCounterclockwise = () =>
    setRotation((prev) => (prev - 15 + 360) % 360);

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
              `bg-${options.color.tw}`,
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
            {/* Apply rotation using inline style */}
            <PhoneCaseImage
              src={imageUrl}
              fill
              alt='Your phone case image'
              className='pointer-events-none'
              style={{ transform: `rotate(${rotation}deg)` }} // Apply rotation here
            />
          </div>
        </Rnd>
      </div>

      <div className='bg- flex h-[37.5rem] flex-col bg-white'>
        <ScrollArea className='relative flex-1 overflow-auto'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white'
          />
          <div className='pb-12-pt-8 px-8'>
            <h2 className='text-3xl font-bold tracking-tight'>
              Customize your Phone Case
            </h2>

            <div className='my-6 h-px w-full bg-zinc-200'>
              <div className='relative mt-4 flex h-full flex-col justify-between'>
                <div className='flex flex-col gap-6'>
                  <RadioGroup
                    value={options.color}
                    onChange={(val) => {
                      setOptions((prev) => ({ ...prev, color: val }));
                    }}
                  >
                    <Label>Color: {options.color.label}</Label>
                    <div className='mt-3 flex items-center space-x-3'>
                      {COLORS.map((color) => (
                        <Radio
                          key={color.label}
                          value={color}
                          className={({ active, checked }) =>
                            cn(
                              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 focus:outline-none focus:ring-0 active:outline-none active:ring-0',
                              {
                                [`border-${color.tw}`]: active || checked,
                              },
                            )
                          }
                        >
                          <span
                            className={cn(
                              `bg-${color.tw}`,
                              'h-8 w-8 rounded-full border border-black border-opacity-10',
                            )}
                          />
                        </Radio>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className='relative flex w-full flex-col gap-3'>
                    <Label>Model</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='outline'
                          role='combobox'
                          className='w-full justify-between'
                        >
                          {options.model.label}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {MODELS.options.map((model, indexModel) => (
                          <DropdownMenuItem
                            key={indexModel}
                            className={cn(
                              'flex cursor-default items-center gap-1 p-1.5 text-sm hover:bg-zinc-100',
                              {
                                'bg-zinc-100':
                                  model.label === options.model.label,
                              },
                            )}
                            onClick={() => {
                              setOptions((prev) => ({ ...prev, model }));
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                model.label === options.model.label
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {model.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {[MATERIALS, FINISHES].map(
                    ({ name, options: selectableOptions }) => (
                      <RadioGroup
                        key={name}
                        value={options[name]}
                        onChange={(val) => {
                          setOptions((prev) => ({ ...prev, [name]: val }));
                        }}
                      >
                        <Label>
                          {name.slice(0, 1).toLocaleUpperCase() + name.slice(1)}
                        </Label>
                        <div className='mt-3 space-y-4'>
                          {selectableOptions.map((option, indexOption) => (
                            <Radio
                              key={indexOption}
                              value={option}
                              className={({ active, checked }) =>
                                cn(
                                  'relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-3 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between',
                                  { 'border-primary': active || checked },
                                )
                              }
                            >
                              <span className='flex items-center'>
                                <span className='flex flex-col text-sm'>
                                  <label>{option.label}</label>
                                  {option.description ? (
                                    <Radio className='text-gray-500'>
                                      <span className='block sm:inline'>
                                        {option.description}
                                      </span>
                                    </Radio>
                                  ) : null}
                                </span>
                              </span>
                            </Radio>
                          ))}
                        </div>
                      </RadioGroup>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      {/* Add controls for rotating the image */}
      <div className='mt-4'>
        <label htmlFor='rotation'>Rotation</label>
        <input
          id='rotation'
          type='range'
          min='0'
          max='360'
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
        />
      </div>
      {/* <div className='mt-6 flex flex-col gap-4'>
        <button
          className='flex items-center justify-center gap-2 rounded bg-gray-200 p-2 hover:bg-gray-300'
          onClick={rotateClockwise}
        >
          <RotateCw className='h-5 w-5' />
          Rotate Clockwise
        </button>
        <button
          className='flex items-center justify-center gap-2 rounded bg-gray-200 p-2 hover:bg-gray-300'
          onClick={rotateCounterclockwise}
        >
          <RotateCcw className='h-5 w-5' />
          Rotate Counterclockwise
        </button>
      </div> */}
    </div>
  );
}
