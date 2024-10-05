import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';
import type { Dispatch, SetStateAction } from 'react';
import { buttonVariants } from './ui/button';

function LoginModel({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className='absolute z-[999]'>
        <DialogHeader>
          <div className='relative mx-auto mb-2 size-24'>
            <Image
              src={'/snake-1.png'}
              alt='logo image'
              className='object-contain'
              fill
            />
          </div>
          <DialogTitle className='text-center text-2xl font-bold tracking-tight text-gray-900'>
            Please, Log in to continue
          </DialogTitle>
          <DialogDescription className='py-2 text-center text-base'>
            <span className='font-medium text-violet-700'>
              Your choices are saved!
            </span>{' '}
            Please login or create an account to complete your customize Phone
            Case...
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6 divide-x divide-gray-200'>
          <LoginLink className={buttonVariants({ variant: 'outline' })}>
            Login
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: 'default' })}>
            Sign up
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModel;
