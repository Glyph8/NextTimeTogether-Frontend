"use client";

import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

interface ProvidersProps {
  children: React.ReactNode;
  nonce?: string;
}

export function Providers({ children, nonce }: ProvidersProps) {
  const { isRestoring } = useAuthSession();
  const [queryClient] = useState(
    () =>
      new QueryClient({
      })
  );

  if (isRestoring) {
    return <DefaultLoading />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "my-custom-toast",
        }}
      />
    </QueryClientProvider>
  );
}
