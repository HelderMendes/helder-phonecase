'use client';
import PhoneCaseImage from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn, formatPrice } from '@/lib/utils';
import { Rnd } from 'react-rnd';
import HandleComponent from '@/components/HandleComponent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup } from '@headlessui/react';
import { useRef, useState } from 'react';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react';
import RotateImageHandler from '@/components/RotateImageHandler';
import { BASE_PRICE } from '@/config/products';
import { useUploadThing } from '@/lib/uploadthing';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { SaveConfigArgs, saveConfig as _saveConfig } from './actions';
import { useRouter } from 'next/navigation';

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
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: saveConfig } = useMutation({
    mutationKey: ['save-phone-case-config'],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description:
          'There was a problem onerror on our end. Please try again!',
        variant: 'destructive',
      });
    },

    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });

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

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 2,
    height: imageDimensions.height / 2,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 130,
    y: 130,
  });

  // State to manage rotation
  const [rotation, setRotation] = useState<number>(0);

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing('imageUploader');

  async function saveConfiguration() {
    try {
      if (!phoneCaseRef.current || !containerRef.current) {
        console.error('Refs are not initialized');
        return; // Exit early if refs are not ready
      }

      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d'); // ctx === context

      const userImage = new Image();
      userImage.crossOrigin = 'anonymous'; // helps to prevent crossOrigin problems
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height,
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(',')[1];
      //convert string van base64 into image
      const blob = base64ToBlob(base64Data, 'image/png');
      const file = new File([blob], 'filename.png', { type: 'image/png' });

      await startUpload([file], { configId });
      toast({
        title: 'Your cropped image is saved',
        description: 'Nicely done',
        variant: 'default',
      });
    } catch (err) {
      console.log(err);

      toast({
        title: 'Something went wrong',
        description:
          'There was a problem on saving you cropped image (config), Please try again!',
        variant: 'destructive',
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <div className='relative mb-6 mt-20 grid grid-cols-1 pb-6 lg:grid-cols-3'>
      <div
        className='relative col-span-2 flex h-[45rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        ref={containerRef}
      >
        <div className='pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50'>
          <AspectRatio
            ref={phoneCaseRef}
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
            x: 130,
            y: 130,
            height: imageDimensions.height / 2,
            width: imageDimensions.width / 2,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
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

      <div className='order-2 col-span-full mt-12 flex h-[45rem] flex-col bg-white lg:order-1 lg:col-span-1 lg:mt-0'>
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
                        <RadioGroup.Option
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
                        </RadioGroup.Option>
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
                            <RadioGroup.Option
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
                                  {/* <label>{option.label}</label> */}
                                  <RadioGroup.Label
                                    className='font-medium text-gray-900'
                                    as='span'
                                  >
                                    {option.label}
                                  </RadioGroup.Label>
                                  {option.description ? (
                                    <RadioGroup.Description className='text-gray-500'>
                                      <span className='block sm:inline'>
                                        {option.description}
                                      </span>
                                    </RadioGroup.Description>
                                  ) : null}
                                </span>
                              </span>

                              <RadioGroup.Description
                                className={cn(
                                  'mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right',
                                )}
                              >
                                <span className='font-medium text-gray-900'>
                                  {formatPrice(option.price / 100)}
                                </span>
                              </RadioGroup.Description>
                            </RadioGroup.Option>
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
        <div className='h-18 mb-4 w-full bg-white px-8'>
          <div className='mt-2 h-px w-full bg-zinc-200' />
          <div className='flex h-full w-full items-center justify-end pt-2'>
            <div className='flex w-full items-center gap-4'>
              <p className='whitespace-nowrap text-lg font-semibold text-zinc-600'>
                {formatPrice(
                  (BASE_PRICE + options.material.price + options.finish.price) /
                    100,
                )}
              </p>
              <Button
                // onClick={(e) => saveConfiguration(e)}
                onClick={() =>
                  saveConfig({
                    configId,
                    color: options.color.value,
                    model: options.model.value,
                    material: options.material.value,
                    finish: options.finish.value,
                  })
                }
                size='sm'
                className='ml-3 w-full text-base font-semibold'
              >
                Continue <ArrowRight className='ml-1.5 inline h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='col-span-2 bg-white lg:order-2 lg:mt-0'>
        <RotateImageHandler rotation={rotation} setRotation={setRotation} />
      </div>
    </div>
  );
}

// bg-black-700 border-black-700
// bg-blue-700 border-blue-700
// bg-rose-700 border-rose-700
// bg-violet-700 border-violet-700
// bg-yellow-700 border-yellow-700
// bg-teal-700 border-teal-700
