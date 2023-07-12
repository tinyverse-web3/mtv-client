import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';
import { isEqual } from 'lodash';
import account, { Account } from '@/lib/account/account';
interface AccountInfo {
  publicKey: string;
  avatar: string;
  name: string;
  address: string;
  safeLevel: number;
  isDefaultPwd: boolean;
  bindStatus: boolean;
  maintainPhrase: boolean;
  maintainProtector: boolean;
  maintainQuestion: boolean;
  hasFeatureData: boolean;
  privacyInfo: any;
  note_ipfs: string;
  pointAccount: any;
  subAccount: any[];
  guardians: any[];
}
interface AccountState {
  account: Account;
  accountInfo: AccountInfo;
  web3AccountSelect: string;
  setWeb3Select: (v: string) => void;
  getLocalAccountInfo: () => void;
  delAccount: () => void;
  setAccountInfo: (v: any) => void;
}

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      (set, get) => ({
        account,
        accountInfo: {
          publicKey: '',
          avatar: '',
          name: '',
          address: '',
          safeLevel: 0,
          isDefaultPwd: true,
          bindStatus: false,
          maintainPhrase: false,
          maintainProtector: false,
          maintainQuestion: false,
          hasFeatureData: false,
          privacyInfo: {},
          note_ipfs: '',
          subAccount: [],
          guardians: [],
          pointAccount: {},
        },
        web3AccountSelect: '',
        setWeb3Select: (v: string) => set({ web3AccountSelect: v }),
        getLocalAccountInfo: async () => {
          const localInfo = await account.getAccountInfo();
          let { accountInfo } = get();
          console.log('localInfo', localInfo);
          accountInfo = Object.assign(accountInfo, {
            publicKey: localInfo.PublicKey,
            address: localInfo.Address,
            hasFeatureData: localInfo.IsSetVault || false,
            guardians: localInfo.Guardians || [],
            bindStatus: !!localInfo.Guardians?.length,
            avatar: localInfo.ImgCid,
            isDefaultPwd: !localInfo.IsChangedPassword,
          });
          set({ accountInfo });
        },
        setAccountInfo: (data: any) => {
          let { accountInfo } = get();
          set({ accountInfo: { ...accountInfo, ...data } });
        },
        delAccount: async () => {
          await account.remove();
          set({
            accountInfo: {
              publicKey: '',
              avatar: '',
              name: '',
              address: '',
              safeLevel: 0,
              isDefaultPwd: true,
              bindStatus: false,
              maintainPhrase: false,
              maintainProtector: false,
              maintainQuestion: false,
              hasFeatureData: false,
              privacyInfo: {},
              note_ipfs: '',
              subAccount: [],
              guardians: [],
              pointAccount: {},
            },
          })
        }
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
