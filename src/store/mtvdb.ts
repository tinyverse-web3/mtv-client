import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MtvDb } from '@/lib/mtv-db';

const mtvDb = MtvDb.getInstance();
window.mtvDb = mtvDb;
interface MtvdbState {
  mtvDb?: MtvDb;
  init: (privateKey: string, dbAddress?: string, metadataKey?: string) => void;
  create: (privateKey: string) => Promise<{
    dbAddress: string | undefined;
    metadataKey: string | undefined;
  }>;
}

export const useMtvdbStore = create<MtvdbState>()(
  devtools((set, get) => ({
    mtvDb: mtvDb,
    init: async (privateKey, dbAddress, metadataKey) => {
      console.log(privateKey, dbAddress, metadataKey);
      const sk = privateKey.replace(/^0x/, '');
      await get().mtvDb?.createInstance(sk, dbAddress, metadataKey);
    },
    create: async (privateKey) => {
      const sk = privateKey.replace(/^0x/, '');
      await get().mtvDb?.createInstance(sk);
      const { dbAddress, metadataKey } = get().mtvDb || {};
      return { dbAddress, metadataKey };
    },
  })),
);
