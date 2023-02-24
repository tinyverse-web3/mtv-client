import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';

interface UserInfo {
  email?: string;
  nostr?: {
    pk: string;
    sk: string;
  };
}

interface GlobalState {
  isLogin: boolean;
  showLogin: boolean;
  token: string;
  maintain: boolean;
  userInfo: UserInfo;
  logout: () => void;
  setUserInfo: (UserInfo: UserInfo) => void;
  setToken: (token: string) => void;
  setShowLogin: (visibly: boolean) => void;
  setMaintain: (status: boolean) => void;
  generateUser: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        isLogin: false,
        showLogin: false,
        maintain: false,
        userInfo: {},
        token: '',
        setUserInfo: (v) => {
          const _user = get().userInfo;
          set(() => ({ userInfo: { ..._user, ...v } }));
        },
        setShowLogin: (v) => set(() => ({ showLogin: v })),
        logout: () =>
          set(() => ({ token: '', isLogin: false, showLogin: true })),
        setToken: (v) =>
          set({ token: v, isLogin: true, showLogin: false }),
        setMaintain: (v) => set(() => ({ maintain: v })),
        generateUser: () => {
          const user = generateKeys();
          set({ userInfo: { nostr: user } });
        },
      }),
      {
        name: 'global-store',
      },
    ),
  ),
);
