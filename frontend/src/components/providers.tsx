"use client";

import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { ThemeTransitionProvider } from "@/components/theme-transition";
import { store } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ThemeTransitionProvider>
        <ReduxProvider store={store}>{children}</ReduxProvider>
      </ThemeTransitionProvider>
    </ThemeProvider>
  );
}

