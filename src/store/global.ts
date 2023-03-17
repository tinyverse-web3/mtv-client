import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';

interface UserInfo {
  email?: string;
  nickname?: string;
}
const metadataKey =
  'kzwfwjn5ji4pupd2pb0qcfwlah3qc9ud9w2n1d3vgesiiidv1uk7t1wfx5ntb6w';
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
  checkLoading: boolean;
  maintain: boolean;
  userInfo: UserInfo;
  nostr?: NostrInfo;
  logout: () => void;
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
        userInfo: {},
        mtvdbInfo: {
          // metadataKey,
        },
        setUserInfo: (v) => {
          const _user = get().userInfo;
          set(() => ({ userInfo: { ..._user, ...v } }));
        },
        setShowLogin: (v) => set(() => ({ showLogin: v })),
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
