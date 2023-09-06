import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';

interface AuthenticatorState {
  list: any[];
  getList: () => void;
}
export const useAuthenticatorStore = create<AuthenticatorState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [],
        getList: async () => {
          const { data, code } = await account.getAuthenticatorCodes();
          if (code === '000000') {
            set({ list: data || [] });
          }
        },
      }),
      {
        name: 'authenticator-storage',
      },
    ),
  ),
);
