import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account, { Account } from '@/lib/account/account';
import toast from 'react-hot-toast';

interface Password {
  Id?: string;
  Title: string;
  Account: string;
  Password: string;
  Url: string;
}
interface PasswordState {
  list: Password[];
  add: (Password: Password) => void;
  getList: () => void;
  remove: (id: string) => void;
  update: (Password: Password) => void;
  getById: (id: string) => Password | undefined;
}

export const usePasswordStore = create<PasswordState>()(
  devtools(
    (set, get) => ({
      list: [],
      add: async (n) => {
        const list = cloneDeep(get().list);
        // list.push(n);
        const { code, data, msg } = await account.addCodebook({
          Title: n.Title,
          Account: n.Account,
          Password: n.Password,
          Url: n.Url,
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
        const { code, data, msg } = await account.getCodebookList();
        if (code === '000000') {
          set({ list: data || [] });
        } else {
          toast.error(msg);
          throw new Error(msg);
        }
      },
      remove: async (id) => {
        const list = cloneDeep(get().list);
        const { code, msg } = await account.delCodebook({ Id: id });
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
          const { code, msg } = await account.modifyCodebook({ Id, ...res });
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
      getById: (id) => {
        const list = get().list;
        return list.find((i) => i.Id === id);
      },
    }),
    // {
    //   name: 'password-store',
    // },
  ),
);
