import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MtvDb } from '@/lib/mtv-db';

const mtvDb = new MtvDb();
window.mtvDb = mtvDb;
let createStatus = false;
interface MtvdbState {
  mtvDb?: MtvDb;
  init: (privateKey: string, dbAddress?: string) => void;
}

export const useMtvdbStore = create<MtvdbState>()(
  devtools((set, get) => ({
    mtvDb: mtvDb,
    init: async (privateKey, dbAddress) => {
      if (createStatus) return;
      createStatus = true;
      const sk = privateKey.replace(/^0x/, '');
      // await get().mtvDb?.closeDb();
      await get().mtvDb?.createInstance(sk, dbAddress);
    },
  })),
);
