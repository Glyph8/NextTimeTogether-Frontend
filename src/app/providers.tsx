'use client';

import { Toaster } from 'react-hot-toast';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import DefaultLoading from '@/components/ui/Loading/DefaultLoading';

// 1. Providers가 받을 props 타입을 정의합니다.
interface ProvidersProps {
  children: React.ReactNode;
}

// 2. props로 { children, nonce }를 받습니다. TODO : nonce 반영되고 있는 지 체크.

export function Providers({ children }: ProvidersProps) {
  const { isRestoring } = useAuthSession();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // ... (queryClient 옵션)
      })
  );

  if (isRestoring) {
    return <DefaultLoading />
  }
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "my-custom-toast",
        }}

      />
    </QueryClientProvider>
  );
}