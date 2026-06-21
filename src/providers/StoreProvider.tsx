import { ReactNode } from 'react';

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  // Wrapper placeholder para futuras integraciones con Zustand y stores modulares.
  return <>{children}</>;
};
