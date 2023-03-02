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
          mtvdb: {},
        },
        token: '',
        setUserInfo: (v) => {
          const _user = get().userInfo;
          set(() => ({ userInfo: { ..._user, ...v } }));
        },
        setShowLogin: (v) => set(() => ({ showLogin: v })),
        logout: () =>
          set(() => ({ token: '', isLogin: false, showLogin: true })),
        setToken: (v) => set({ token: v, isLogin: true, showLogin: false }),
        setMaintain: (v) => set(() => ({ maintain: v })),
        setCheckLoading: (v) => set(() => ({ checkLoading: v })),
        createNostr: () => {
          const user = generateKeys();
          set({ nostr: user });
          return user;
        },
        setNostr: (n) => {
          console.log(n);
          set({ nostr: n });
          console.log(get().nostr);
        },
        setMtvdbToUser: (dbAddress, metadataKey) => {
          set({
            userInfo: { ...get().userInfo, mtvdb: { dbAddress, metadataKey } },
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
