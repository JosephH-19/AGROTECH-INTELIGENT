import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Placeholder para futuros temas y modos de visualización.
  return <>{children}</>;
};
