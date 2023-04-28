import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { MtvStorage, MtvCrypto } from '@/lib/account';

interface MtvdbState {
  mtvStorage?: MtvStorage;
  init: (privateKey: string) => void;
  resume: (privateKey: string) => void;
  destory: () => void;
}

export const useMtvStorageStore = create<MtvdbState>()(
  devtools(
    persist(
      (set, get) => ({
        mtvStorage: undefined,
        init: async (privateKey) => {
          try {
            const crypt = new MtvCrypto(privateKey);
            const storage = new MtvStorage(privateKey, crypt);
            await storage.init();
            window.mtvStorage = storage;
            await set({ mtvStorage: storage });
          } catch (error) {
            console.log(error);
          }
        },
        resume: async (privateKey) => {
          try {
            const crypt = new MtvCrypto(privateKey);
            const storage = new MtvStorage(privateKey, crypt);
            await storage.init();
            window.mtvStorage = storage;
            await storage.connect();
            await storage.resume();
            await set({ mtvStorage: storage });
          } catch (error) {
            console.log(error);
          }
        },
        destory: () => {
          set({ mtvStorage: undefined });
          if (get().mtvStorage) {
            get().mtvStorage?.destory();
          }
        },
      }),
      {
        name: 'mtv-stroage-store',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => ['ipns'].includes(key)),
          ),
      },
    ),
  ),
);
