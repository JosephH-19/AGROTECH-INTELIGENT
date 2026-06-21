import { create } from 'zustand';

interface SyncState {
  isSyncing: boolean;
  setSyncing: (isSyncing: boolean) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  setSyncing: (isSyncing) => set({ isSyncing })
}));
