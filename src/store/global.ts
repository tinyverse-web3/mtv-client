import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalState {
  showLogin: boolean;
  loading: boolean;
  checkLoading: boolean;
  lockStatus: boolean;
  defaultPasswordShow: boolean;
  logout: () => void;
  setShowLogin: (visibly: boolean) => void;
  setLoading: (l: boolean) => void;
  setCheckLoading: (visibly: boolean) => void;
  setDefaultPasswordShow: (show: boolean) => void;
  reset: () => void;
  setLockStatus: (b: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        showLogin: false,
        checkLoading: false,
        loading: false,
        defaultPasswordShow: false,
        lockStatus: true,
        setLockStatus(b) {
          set({ lockStatus: b });
        },
        setLoading(b) {
          set({ loading: b });
        },
        setShowLogin: (v) => set(() => ({ showLogin: v })),
        setDefaultPasswordShow: (v) => set(() => ({ defaultPasswordShow: v })),

        logout: () => set(() => ({ bindStatus: false, showLogin: false })),
        setCheckLoading: (v) => set(() => ({ checkLoading: v })),
        reset: () => {
          set({
            showLogin: false,
            checkLoading: false,
            defaultPasswordShow: false,
            lockStatus: true,
          });
        },
      }),
      {
        name: 'global-store',
      },
    ),
  ),
);

// useGlobalStore.subscribe((state, prevState) => {
//   if (isEqual(state.userInfo, prevState.userInfo) || !window?.mtvStorage)
//     return;
//   const { userInfo } = state;
//
//   window?.mtvStorage?.put('userInfo', userInfo);
// });
