import { create } from 'zustand';

interface AppState {
  isOnline: boolean;
  setOnlineStatus: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: navigator.onLine,
  setOnlineStatus: (status) => set({ isOnline: status })
}));
