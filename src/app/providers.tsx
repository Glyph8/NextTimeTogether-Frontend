'use client'; 

import { AuthInitializer } from '@/components/shared/Auth/AuthInitializer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from "@/components/ui/sonner";

// 1. Providers가 받을 props 타입을 정의합니다.
interface ProvidersProps {
  children: React.ReactNode;
  nonce: string; // nonce를 필수로 받습니다.
}

// 2. props로 { children, nonce }를 받습니다.
export function Providers({ children, nonce }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // ... (queryClient 옵션)
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
       <AuthInitializer />
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}

      {/* 3. Toaster에 nonce를 전달하고, 인라인 style을 className으로 변경합니다. */}
      {/* <Toaster
        position="bottom-center"
        toastOptions={{
          // 5. 인라인 스타일(style: {...})을 제거합니다.
          // style: { background: 'rgba(0, 0, 0, 0.60)', ... }
          
          // 6. 대신 CSS 클래스 이름을 지정합니다.
          className: "my-custom-toast",
        }}
        nonce={nonce} // <-- 4. CSP nonce 값을 전달
      /> */}
    </QueryClientProvider>
  );
}