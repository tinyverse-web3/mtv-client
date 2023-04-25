import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { MtvStorage, MtvCrypto } from '@/lib/account';

interface MtvdbState {
  mtvStorage?: MtvStorage;
  ipns: string;
  init: (privateKey: string, ipns?: string) => void;
  setIpns: (ipns: string) => void;
  reset: () => void;
  resume: (ipns: string) => void;
  destory: () => void;
}

export const useMtvStorageStore = create<MtvdbState>()(
  devtools(
    persist(
      (set, get) => ({
        mtvStorage: undefined,
        ipns: '',
        init: async (privateKey, ipns) => {
          try {
            const crypt = new MtvCrypto(privateKey);
            const storage = new MtvStorage(privateKey, crypt);
            const getIpns = (ipns: string) => {
              console.log('ipns: ', ipns);
              set({ ipns });
            };
            await storage.init(getIpns);
            if (ipns) {
              await storage.resume(ipns);
            }
            window.mtvStorage = storage;
            set({ mtvStorage: storage });
          } catch (error) {
            console.log(error);
          }
        },
        setIpns: (ipns) => {
          set({ ipns });
        },
        reset: () => {
          set({ ipns: '' });
        },
        destory: () => {
          set({ mtvStorage: undefined });
          if (get().mtvStorage) {
            get().mtvStorage?.destory();
          }
        },
        resume: async (ipns) => {
          if (get().mtvStorage) {
            await get().mtvStorage?.resume(ipns);
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
