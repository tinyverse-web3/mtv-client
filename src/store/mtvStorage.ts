import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { MtvStorage, MtvCrypto } from '@/lib/account';

interface MtvdbState {
  mtvStorage?: MtvStorage;
  init: (privateKey: string) => void;
  resume: () => void;
  destory: () => void;
  // retryResume: () => void;
}

export const useMtvStorageStore = create<MtvdbState>()(
  devtools(
    persist(
      (set, get) => ({
        mtvStorage: undefined,
        init: async (privateKey) => {
          const crypt = new MtvCrypto(privateKey);
          const storage = new MtvStorage(privateKey, crypt);
          await storage.init();
          window.mtvStorage = storage;
          await set({ mtvStorage: storage });
        },
        resume: async () => {
          // throw new Error("error");
          // const crypt = new MtvCrypto(privateKey);
          // const storage = new MtvStorage(privateKey, crypt);
          // await storage.init();
          // window.mtvStorage = storage;
          const { mtvStorage } = get();
          await mtvStorage?.connect();
          await mtvStorage?.resume();
          // await set({ mtvStorage: storage });
        },
        // retryResume: async () => {
        //   const { mtvStorage } = get();
        //   mtvStorage?.resume();
        // },
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
