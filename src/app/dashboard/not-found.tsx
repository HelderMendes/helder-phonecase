'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const DashboardNotAllowed = () => {
  const router = useRouter();

  return (
    <div className='flex h-screen flex-col items-center justify-center gap-14 bg-violet-100'>
      <h1 className='bold text-lg'>
        Sorry, but you don&apos;t have permission to log in to this page.
      </h1>
      <p>
        <Button size='lg' variant='outline' onClick={() => router.back()}>
          Go Back
        </Button>
      </p>
      <Button size='lg' variant='default' onClick={() => router.push('/')}>
        Go back to Home
      </Button>
    </div>
  );
};

export default DashboardNotAllowed;
