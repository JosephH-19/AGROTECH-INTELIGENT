import { ReactNode } from 'react';
import { RouterProvider } from './RouterProvider';
import { StoreProvider } from './StoreProvider';
import { I18nProvider } from './I18nProvider';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <RouterProvider>
    <I18nProvider>
      <StoreProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </StoreProvider>
    </I18nProvider>
  </RouterProvider>
);
