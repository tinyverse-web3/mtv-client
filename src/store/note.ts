import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import { useMtvdbStore } from './mtvdb';
interface Note {
  id: string;
  title: string;
  updated: Date | number;
  content: string;
}
interface GlobalState {
  list: Note[];
  add: (note: Note) => void;
  init: (list: any[]) => void;
  remove: (id: string) => void;
  update: (note: Note) => void;
  get: (id: string) => Promise<Note | undefined>;
}

export const useNoteStore = create<GlobalState>()(
  devtools(
    (set, get) => ({
      list: [],
      add: async (n) => {
        const list = cloneDeep(get().list);
        list.push(n);
        await window?.mtvDb.put('note', JSON.stringify(list));
        set({ list });
      },
      init: async (n) => {
        set({ list: n });
      },
      remove: async (id) => {
        const list = cloneDeep(get().list);
        remove(list, (i) => i.id === id);
        await window?.mtvDb.put('note', JSON.stringify(list));
        set({ list });
      },
      update: async ({ id, ...res }) => {
        const list = cloneDeep(get().list);
        let itemIndex = list.findIndex((i) => i.id === id);
        if (itemIndex >= 0) {
          list[itemIndex] = {
            ...list[itemIndex],
            ...res,
          };
          await window?.mtvDb.put('note', JSON.stringify(list));
          set({ list });
        }
      },
      get: async (id) => {
        const list = get().list;
        return list.find((i) => i.id === id);
      },
    }),
    {
      name: 'note-store',
    },
  ),
);
useNoteStore.subscribe(async (state, prevdata) => {
  const mtvDb = window.mtvDb;
  if (mtvDb && prevdata.list.length && JSON.stringify(state.list) !== JSON.stringify(prevdata.list)) {
    console.log('备份数据');
    await mtvDb.backupDb();
  }
});
