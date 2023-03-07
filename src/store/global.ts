import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';

interface UserInfo {
  email?: string;
  mtvdb?: {
    dbAddress?: string;
    metadataKey?: string;
  };
}
const metadataKey =
  'kzwfwjn5ji4pupd2pb0qcfwlah3qc9ud9w2n1d3vgesiiidv1uk7t1wfx5ntb6w';
interface NostrInfo {
  pk: string;
  sk: string;
}
interface GlobalState {
  isLogin: boolean;
  showLogin: boolean;
  checkLoading: boolean;
  token: string;
  maintain: boolean;
  userInfo: UserInfo;
  nostr?: NostrInfo;
  logout: () => void;
  setUserInfo: (UserInfo: UserInfo) => void;
  setToken: (token: string) => void;
  setShowLogin: (visibly: boolean) => void;
  setCheckLoading: (visibly: boolean) => void;
  setMaintain: (status: boolean) => void;
  setNostr: (n: NostrInfo) => void;
  createNostr: () => NostrInfo;
  reset: () => void;
  setMtvdbToUser: (dbAddress?: string, metadataKey?: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        isLogin: false,
        showLogin: false,
        maintain: false,
        checkLoading: true,
        userInfo: {
          mtvdb: {
            // metadataKey,
          },
        },
        token: '',
        setUserInfo: (v) => {
          const _user = get().userInfo;
          set(() => ({ userInfo: { ..._user, ...v } }));
        },
        setShowLogin: (v) => set(() => ({ showLogin: v })),
        logout: () =>
          set(() => ({ token: '', isLogin: false, showLogin: false })),
        setToken: (v) => set({ token: v, isLogin: true }),
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
        setMtvdbToUser: (dbAddress, metadataKey) => {
          set({
            userInfo: { ...get().userInfo, mtvdb: { dbAddress, metadataKey } },
          });
        },
        reset: () => {
          set({
            isLogin: false,
            showLogin: false,
            maintain: false,
            checkLoading: false,
            userInfo: {
              mtvdb: {
              },
            },
            token: '',
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
