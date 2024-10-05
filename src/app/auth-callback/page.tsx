'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAuthStatus } from './actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function AuthCallbackPage() {
  // Is there something in the local storage?
  const [configId, setConfigId] = useState<string | null>(null);
  const router = useRouter();

  // Check localStorage once
  useEffect(() => {
    const configurationId = localStorage.getItem('configurationId');
    if (configurationId) setConfigId(configurationId);
  }, []);

  const { data } = useQuery({
    queryKey: ['auth-callback'],
    queryFn: async () => await getAuthStatus(),
    retry: true,
    retryDelay: 500,
  });

  if (data?.success) {
    if (configId) {
      localStorage.removeItem('configurationId');
      router.push(`/configure/preview?id=${configId}`);
    } else {
      router.push('/');
    }
  }

  return (
    <div className='mt-24 flex w-full justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='size-8 animate-spin text-zinc-500' />
        <h3 className='text-xl font-semibold'>Logging you in...</h3>
        <p>You are almost there... You will be automatically redirected</p>
      </div>
    </div>
  );
}

export default AuthCallbackPage;
