import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MtvStorage, MtvCrypto } from '@/lib/account';

interface MtvdbState {
  mtvStorage?: MtvStorage;
  loaded: boolean;
  init: (privateKey: string, ipns?: string) => void;
  resume: (ipns: string) => void;
  destory: () => void;
}

export const useMtvStorageStore = create<MtvdbState>()(
  devtools((set, get) => ({
    mtvStorage: undefined,
    loaded: false,
    init: async (privateKey, ipns) => {
      try {
        const crypt = new MtvCrypto(privateKey);
        const storage = new MtvStorage(privateKey, crypt);
        await storage.init();
        if (ipns) {
          await storage.resume(ipns);
        }
        window.mtvStorage = storage;
        set({ mtvStorage: storage });
        set({ loaded: true });
      } catch (error) {
        console.log(error);
      }
    },
    destory: () => {
      set({ mtvStorage: undefined });
    },
    resume: async (ipns) => {
      if (get().mtvStorage) {
        await get().mtvStorage?.resume(ipns);
      }
    },
  })),
);
