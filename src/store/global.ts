import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';

interface UserInfo {
  email?: string;
  avatar?: string;
  nickname?: string;
}
const metadataKey =
  'kzwfwjn5ji4pupd2pb0qcfwlah3qc9ud9w2n1d3vgesiiidv1uk7t1wfx5ntb6w';

/* userLevel 用户等级
0级：临时账户，账户无法恢复，数据随时会丢失，请尽快做账户维护。
1级：账户存在单点故障，请尽快做账户维护。
2级：账户依赖其他账户的安全，请尽快做账户维护。
3级：低标准账户，建议提示安全级别。
4级：标准账户，您的账户已经很安全，但还有提升空间。
5级：高标准账户，您的账户已经得到完全的保护。
*/
interface NostrInfo {
  pk: string;
  sk: string;
}
interface GlobalState {
  bindStatus: boolean;
  showLogin: boolean;
  mtvdbInfo: {
    dbAddress?: string;
    metadataKey?: string;
  };
  userLevel: number;
  maintainPhrase: boolean;
  maintainProtector: boolean;
  maintainQuestion: boolean;
  checkLoading: boolean;
  maintain: boolean;
  userInfo: UserInfo;
  nostr?: NostrInfo;
  logout: () => void;
  setUserLevel: (l: number) => void;
  calcUserLevel: () => void;
  setMaintainPhrase: (v: boolean) => void;
  setMaintainProtector: (v: boolean) => void;
  setMaintainQuestion: (v: boolean) => void;
  setUserInfo: (UserInfo: UserInfo) => void;
  setBindStatus: (status: boolean) => void;
  setShowLogin: (visibly: boolean) => void;
  setCheckLoading: (visibly: boolean) => void;
  setMaintain: (status: boolean) => void;
  setNostr: (n: NostrInfo) => void;
  createNostr: () => NostrInfo;
  reset: () => void;
  setMtvdb: (dbAddress?: string, metadataKey?: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        bindStatus: false,
        showLogin: false,
        maintain: false,
        checkLoading: true,
        userLevel: 0,
        maintainPhrase: false,
        maintainProtector: false,
        maintainQuestion: false,
        userInfo: {},
        mtvdbInfo: {
          // metadataKey,
        },
        setUserInfo: (v) => {
          const _user = get().userInfo;
          set(() => ({ userInfo: { ..._user, ...v } }));
        },
        setShowLogin: (v) => set(() => ({ showLogin: v })),
        setUserLevel: (l) => {
          if (l > get().userLevel) {
            set(() => ({ userLevel: l }))
          }
        },
        setMaintainPhrase: (v) => set(() => ({ maintainPhrase: v })),
        setMaintainProtector: (v) => set(() => ({ maintainProtector: v })),
        setMaintainQuestion: (v) => set(() => ({ maintainQuestion: v })),
        calcUserLevel: () => {
          const { maintainPhrase, maintainProtector, maintainQuestion } = get();
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
          set({ userLevel: level });
        },
        logout: () => set(() => ({ bindStatus: false, showLogin: false })),
        setBindStatus: (v) => set({ bindStatus: v }),
        setMaintain: (v) => set(() => ({ maintain: v })),
        setCheckLoading: (v) => set(() => ({ checkLoading: v })),
        createNostr: () => {
          const user = generateKeys();
          set({ nostr: user });
          return user;
        },
        setNostr: (n) => {
          set({ nostr: n });
        },
        setMtvdb: (dbAddress, metadataKey) => {
          set({ mtvdbInfo: { dbAddress, metadataKey } });
        },
        reset: () => {
          set({
            bindStatus: false,
            showLogin: false,
            maintain: false,
            checkLoading: false,
            userInfo: {},
            mtvdbInfo: {},
          });
        },
      }),
      {
        name: 'global-store',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !['nostr', 'checkLoading'].includes(key),
            ),
          ),
      },
    ),
  ),
);
