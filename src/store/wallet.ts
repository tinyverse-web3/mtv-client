import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account, { Account } from '@/lib/account/account';
import toast from 'react-hot-toast';

interface Wallet {
  Name: string;
  Type: string;
  Address: string;
  Balance: string;
  BalanceDollar?: string;

}
interface WalletState {
  list: Wallet[];
  add: (note: Wallet) => void;
  getList: () => void;
  remove: (name: string) => void;
  update: (note: Wallet) => void;
  get: (name: string) => Promise<Wallet | undefined>;
  reset: () => void;
}

export const useWalletStore = create<WalletState>()(
  devtools(
    (set, get) => ({
      list: [],
      add: async (n) => {
        const list = cloneDeep(get().list);
        // const { code, data, msg } = await account.addNote({
        //   Title: n.Title,
        //   Content: n.Content,
        // });
        // if (code === '000000') {
        //   list.push(data);
        //   set({ list });
        // } else {
        //   toast.error(msg);
        //   throw new Error(msg);
        // }
      },
      getList: async () => {
        const { code, data, msg } = await account.getWallets();
        if (code === '000000') {
          set({ list: data || [] });
        } else {
          toast.error(msg);
          throw new Error(msg);
        }
      },
      remove: async (address) => {
        const list = cloneDeep(get().list);
        // const { code, msg } = await account.delNote({ Id: id });
        // if (code === '000000') {
        //   remove(list, (i) => i.Id === id);
        //   set({ list });
        // } else {
        //   toast.error(msg);
        //   throw new Error(msg);
        // }
      },
      update: async ({ Address, ...res }) => {
        // const list = cloneDeep(get().list);
        // let itemIndex = list.findIndex((i) => i.Id === Id);
        // if (itemIndex >= 0) {
        //   const { code, msg } = await account.modifyNote({ Id, ...res });
        //   if (code === '000000') {
        //     list[itemIndex] = {
        //       ...list[itemIndex],
        //       ...res,
        //     };
        //     set({ list });
        //   } else {
        //     toast.error(msg);
        //     throw new Error(msg);
        //   }
        // }
      },
      get: async (address) => {
        const list = get().list;
        return list.find((i) => i.Address === address);
      },
      reset: () => {
        set({ list: [] });
      }
    }),
  ),
);
