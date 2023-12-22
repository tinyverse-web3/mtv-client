import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account, { Account } from '@/lib/account/account';
import toast from 'react-hot-toast';

interface Note {
  Id?: string;
  Title: string;
  Content: string;
  CreateTime?: string;
  ModifyTIme?: string;
}
interface NoteState {
  list: Note[];
  add: (note: Note) => void;
  getList: () => void;
  remove: (id: string) => void;
  update: (note: Note) => void;
  get: (id: string) => Promise<Note | undefined>;
  reset: () => void;
}

export const useNoteStore = create<NoteState>()(
  devtools(
    (set, get) => ({
      list: [],
      add: async (n) => {
        const list = cloneDeep(get().list);
        const { code, data, msg } = await account.addNote({
          Title: n.Title,
          Content: n.Content,
        });
        if (code === '000000') {
          list.push(data);
          set({ list });
        } else {
          toast.error(msg);
          throw new Error(msg);
        }
      },
      getList: async () => {
        const { code, data, msg } = await account.getNotes();
        if (code === '000000') {
          set({ list: data || [] });
        } else {
          toast.error(msg);
          throw new Error(msg);
        }
      },
      remove: async (id) => {
        const list = cloneDeep(get().list);
        const { code, msg } = await account.delNote({ Id: id });
        if (code === '000000') {
          remove(list, (i) => i.Id === id);
          set({ list });
        } else {
          toast.error(msg);
          throw new Error(msg);
        }
      },
      update: async ({ Id, ...res }) => {
        const list = cloneDeep(get().list);
        let itemIndex = list.findIndex((i) => i.Id === Id);
        if (itemIndex >= 0) {
          const { code, msg } = await account.modifyNote({ Id, ...res });
          if (code === '000000') {
            list[itemIndex] = {
              ...list[itemIndex],
              ...res,
            };
            set({ list });
          } else {
            toast.error(msg);
            throw new Error(msg);
          }
        }
      },
      get: async (id) => {
        const list = get().list;
        return list.find((i) => i.Id === id);
      },
      reset: () => {
        set({ list: [] });
      }
    }),
  ),
);
// useNoteStore.subscribe(async (state, prevdata) => {
//   const mtvStorage = window.mtvStorage;
//   if (mtvDb && prevdata.list.length && JSON.stringify(state.list) !== JSON.stringify(prevdata.list)) {
//     console.log('备份数据');
//     // await mtvDb.backupDb();
//   }
// });
