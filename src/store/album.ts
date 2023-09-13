import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';

interface AlbumState {
  list: any[];
  getList: () => void;
  reset: () => void;
}
export const useAlbumStore = create<AlbumState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [],
        getList: async () => {
          const { data, code } = await account.getAlbumList();
          if (code === '000000') {
            set({ list: data || [] });
          }
        },
        reset: async () => {
          set({ list: [] });
        }
      }),
      {
        name: 'album-storage',
      },
    ),
  ),
);
