import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import { useMtvdbStore } from './storage';
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
        const list = get().list;
        list.push(n);
        set({ list });
      },
      init: async (n) => {
        set({ list: n });
      },
      remove: async (id) => {
        const list = cloneDeep(get().list);
        remove(list, (i) => i.id === id);
        console.log(list.length);
        set({ list });
      },
      update: async ({ id, ...res }) => {
        const list = get().list;
        let itemIndex = list.findIndex((i) => i.id === id);
        if (itemIndex >= 0) {
          list[itemIndex] = {
            ...list[itemIndex],
            ...res,
          };
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
useNoteStore.subscribe(async (state) => {
  console.log(state.list);
  const mtvDb = window.mtvDb;
  if (mtvDb) {
    await mtvDb.put('note', JSON.stringify(state.list));
  }
});
