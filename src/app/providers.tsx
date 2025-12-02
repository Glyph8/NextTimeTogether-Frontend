'use client'; 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import DefaultLoading from '@/components/ui/Loading/DefaultLoading';

// 1. Providers가 받을 props 타입을 정의합니다.
interface ProvidersProps {
  children: React.ReactNode;
  nonce: string; // nonce를 필수로 받습니다.
}

// 2. props로 { children, nonce }를 받습니다.
// export function Providers({ children, nonce }: ProvidersProps) {
export function Providers({ children }: ProvidersProps) {
  const { isRestoring } = useAuthSession();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // ... (queryClient 옵션)
      })
  );

  if (isRestoring) {
    return <DefaultLoading/>
  }
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {/* TODO : nonce 호환 되는 toast 라이브러리 찾아서 대체하기 */}
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