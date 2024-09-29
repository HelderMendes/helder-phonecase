import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';

const Footer = () => {
  return (
    <footer className='relative h-20 bg-white'>
      <div className='border-t border-violet-300' />
      <MaxWidthWrapper className='relative'>
        <div className='flex h-full flex-col items-center justify-center md:flex-row md:justify-between'>
          <div className='pb-2 text-center md:pb-0 md:text-left'>
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()}{' '}
              <Link
                href={'https://helderdesign.nl'}
                target='new'
                className='text-[.85rem] text-violet-400 hover:text-violet-600'
              >
                HELDER DESIGN
              </Link>{' '}
              – All rights reserved
            </p>
          </div>

          <div className='flex items-center justify-center'>
            <div className='flex space-x-8'>
              <Link
                href={'#'}
                className='text-sm text-muted-foreground hover:text-gray-600'
              >
                Terms of Use
              </Link>
              <Link
                href={'#'}
                className='text-sm text-muted-foreground hover:text-gray-600'
              >
                Privacy
              </Link>
              <Link
                href={'#'}
                className='text-sm text-muted-foreground hover:text-gray-600'
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
