import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';
import { isEqual } from 'lodash';
import account, { Account } from '@/lib/account/account';

interface AccountState {
  account: Account;
  web3AccountSelect: string;
  setWeb3Select: (v: string) => void;
}
export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      (set, get) => ({
        account,
        web3AccountSelect: '',
        setWeb3Select: (v: string) => set({ web3AccountSelect: v }),
      }),
      {
        name: 'account-store',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) =>
              ['web3AccountSelect'].includes(key),
            ),
          ),
      },
    ),
  ),
);
