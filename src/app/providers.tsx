"use client";

import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

// Webpack 전역 변수 인식 처리
declare let __webpack_nonce__: string | undefined;

interface ProvidersProps {
  children: React.ReactNode;
  nonce?: string;
}

export function Providers({ children, nonce }: ProvidersProps) {
  // Webpack의 동적 청크에 nonce를 주입하기 위한 전역 설정
  if (typeof window !== "undefined" && nonce) {
    __webpack_nonce__ = nonce;
  }
  const { isRestoring } = useAuthSession();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // ... (queryClient 옵션)
      })
  );

  if (isRestoring) {
    return <DefaultLoading />;
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
