import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';
import { isEqual } from 'lodash';
import account, { Account } from '@/lib/account/account';

interface AccountState {
  account: Account;
}
export const useAccountStore = create<AccountState>()(
  devtools((set, get) => ({
    account,
  })),
);
