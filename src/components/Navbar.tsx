import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin =
    user?.email === process.env.ADMIN_EMAIL ||
    user?.email === process.env.ADMIN_EMAIL_01;

  return (
    <nav className='sticky inset-x-0 top-0 z-[100] h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper className=''>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link href={'/'} className='z-40 flex font-semibold'>
            Case<span className='text-[#6d28d9]'>cobra</span>
          </Link>
          <div className='flex h-full items-center space-x-4'>
            {user ? (
              <>
                <LogoutLink
                  className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                >
                  Sign Out{' '}
                </LogoutLink>
                {isAdmin ? (
                  <Link
                    href={'/dashboard'}
                    className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                  >
                    Dashboard 🪄✨
                  </Link>
                ) : null}
                <Link
                  href={'/configure/upload'}
                  className={buttonVariants({
                    size: 'sm',
                    className: 'hidden items-center gap-1 sm:flex',
                  })}
                >
                  Create case
                  <ArrowRight className='ml-1.5 h-5 w-5' />
                </Link>
              </>
            ) : (
              <>
                <RegisterLink
                  className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                >
                  Sign Up
                </RegisterLink>
                <LoginLink
                  className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                >
                  Login
                  <ArrowRight className='ml-1.5 h-5 w-5' />
                </LoginLink>
                {/* visual separator */}
                <div className='hidden h-8 w-px bg-zinc-200 sm:block' />
                <Link
                  href={'/configure/upload'}
                  className={buttonVariants({
                    size: 'sm',
                    className:
                      'hidden items-center gap-1 font-semibold sm:flex',
                  })}
                >
                  Create case
                  <ArrowRight className='ml-1.5 h-5 w-5' />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
