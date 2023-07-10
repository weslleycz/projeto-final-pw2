"use client";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/theme";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

type Props = {
  children: ReactNode;
};

export const MueContainer = ({ children }: Props) => {
  return (
    <>
    <QueryClientProvider client={queryClient}>
     <ThemeProvider theme={theme}>{children}</ThemeProvider>
     </QueryClientProvider>
    </>
  );
};
