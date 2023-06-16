"use client";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/theme";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Container = ({ children }: Props) => {
  return (
    <>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
};
