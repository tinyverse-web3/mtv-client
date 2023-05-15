import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';
import { isEqual } from 'lodash';

interface Guardian {
  name: string;
  type: string;
  id?: string;
}
interface NostrInfo {
  pk: string;
  sk: string;
}
interface Account {
  publicKey: string;
  avatar: string;
  name: string;
  safeLevel: number;
  bindStatus: boolean;
  maintainPhrase: boolean;
  maintainProtector: boolean;
  maintainQuestion: boolean;
  privacyInfo: {};
  nostr: NostrInfo;
  guardians: Guardian[];
}
/* SafeLevel 用户等级
0级：临时账户，账户无法恢复，数据随时会丢失，请尽快做账户维护。
1级：账户存在单点故障，请尽快做账户维护。
2级：账户依赖其他账户的安全，请尽快做账户维护。
3级：低标准账户，建议提示安全级别。
4级：标准账户，您的账户已经很安全，但还有提升空间。
5级：高标准账户，您的账户已经得到完全的保护。
*/

interface AccountState {
  account: Account;
  setAccount: (userInfo: Partial<Account>) => void;
  // saveAccount: () => void;
  calcSafeLevel: () => void;
  getLocalAcclount: () => void;
  reset: () => void;
}

export const useAccountStore = create<AccountState>()(
  devtools((set, get) => ({
    account: {
      publicKey: '',
      avatar: '',
      name: '',
      safeLevel: 0,
      bindStatus: false,
      maintainPhrase: false,
      maintainProtector: false,
      maintainQuestion: false,
      privacyInfo: {},
      nostr: {
        pk: '',
        sk: '',
      },
      guardians: [],
    },
    setAccount: (v) => {
      const { account } = get();
      const _account = { ...account, ...v };
      set(() => ({ account: _account }));
      window?.mtvStorage?.put('account', _account);
    },
    getLocalAcclount: async () => {
      const account = await window?.mtvStorage?.get('account');
      console.log('获取mtvStorage的account');
      console.log(account);
      if (account) {
        set({
          account,
        });
      }
    },
    calcSafeLevel: () => {
      const { account, setAccount } = get();
      const { maintainPhrase, maintainProtector, maintainQuestion } = account;
      let level = 0;
      if (maintainPhrase) {
        level = 1;
      }
      if (maintainProtector) {
        level = 2;
      }
      if (maintainQuestion || (maintainPhrase && maintainProtector)) {
        level = 3;
      }
      setAccount({ safeLevel: level });
    },
    reset: () => {
      set({
        account: {
          publicKey: '',
          avatar: '',
          name: '',
          safeLevel: 0,
          bindStatus: false,
          maintainPhrase: false,
          maintainProtector: false,
          maintainQuestion: false,
          privacyInfo: {},
          nostr: {
            pk: '',
            sk: '',
          },
          guardians: [],
        },
      });
    },
  })),
);
