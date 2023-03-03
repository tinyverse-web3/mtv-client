import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import mtvDb, { MtvDb } from '@/lib/mtv-db';

// const mtvDb = MtvDb.getInstance();
// window.mtvDb = mtvDb;
interface MtvdbState {
  mtvDb?: MtvDb;
  loaded: boolean,
  init: (privateKey: string, dbAddress?: string, metadataKey?: string) => void;
  create: (privateKey: string) => Promise<{
    dbAddress: string | undefined;
    metadataKey: string | undefined;
  }>;
}

export const useMtvdbStore = create<MtvdbState>()(
  devtools((set, get) => ({
    mtvDb: undefined,
    loaded: false,
    init: async (privateKey, dbAddress, metadataKey) => {
      console.log(privateKey, dbAddress, metadataKey);
      const sk = privateKey.replace(/^0x/, '');
      await mtvDb.createInstance(sk, dbAddress, metadataKey);
      window.mtvDb = mtvDb;
      set({ mtvDb });
      if (mtvDb.kvdb) {
        set({ loaded: true})
      }
    },
    create: async (privateKey) => {
      const sk = privateKey.replace(/^0x/, '');
      await mtvDb?.createInstance(sk);
      window.mtvDb = mtvDb;
      const { dbAddress, metadataKey } = mtvDb || {};
      set({ mtvDb });
      if (mtvDb.kvdb) {
        set({ loaded: true})
      }
      return { dbAddress, metadataKey };
    },
  })),
);
