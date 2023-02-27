import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MtvDb } from '@/lib/mtv-db';

interface MtvdbState {
  mtvDb?: MtvDb;
  init: (privateKey: string, dbAddress?: string) => void;
}

export const useMtvdbStore = create<MtvdbState>()(
  devtools((set, get) => ({
    mtvDb: new MtvDb(),
    init: async (privateKey, dbAddress) => {
      const sk = privateKey.replace(/^0x/, '');
      await get().mtvDb?.closeDb();
      await get().mtvDb?.createInstance(sk, dbAddress);
    },
  })),
);
