import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateKeys } from '@/lib/utils/generateKeys';
import { isEqual } from 'lodash';

interface Guardian {
  name: string;
  type: string;
  id?: string;
}
interface UserInfo {
  email?: string;
  publicKey?: string;
  avatar?: string;
  nickname?: string;
  userLevel?: number;
  bindStatus?: boolean;
  maintainPhrase?: boolean;
  maintainProtector?: boolean;
  maintainQuestion?: boolean;
  guardians?: Guardian[];
}
/* userLevel 用户等级
0级：临时账户，账户无法恢复，数据随时会丢失，请尽快做账户维护。
1级：账户存在单点故障，请尽快做账户维护。
2级：账户依赖其他账户的安全，请尽快做账户维护。
3级：低标准账户，建议提升安全级别。
4级：标准账户，您的账户已经很安全，但还有提升空间。
5级：高标准账户，您的账户已经得到完全的保护。
*/
interface NostrInfo {
  pk: string;
  sk: string;
}
interface GlobalState {
  showLogin: boolean;
  // userLevel: number;
  // maintainPhrase: boolean;
  // maintainProtector: boolean;
  // maintainQuestion: boolean;
  checkLoading: boolean;
  lockStatus: boolean;
  userInfo: UserInfo;
  nostr?: NostrInfo;

  logout: () => void;
  // setUserLevel: (l: number) => void;
  // setMaintainPhrase: (v: boolean) => void;
  // setMaintainProtector: (v: boolean) => void;
  // setMaintainQuestion: (v: boolean) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  // setBindStatus: (status: boolean) => void;
  setShowLogin: (visibly: boolean) => void;
  setCheckLoading: (visibly: boolean) => void;
  reset: () => void;
  saveUserInfo: () => void;
  setLockStatus: (b: boolean) => void;
  getLocalUserInfo: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        showLogin: false,
        checkLoading: false,
        lockStatus: true,
        // userLevel: 0,
        // maintainPhrase: false,
        // maintainProtector: false,
        // maintainQuestion: false,
        userInfo: {
          bindStatus: false,
          userLevel: 0,
          maintainPhrase: false,
          maintainProtector: false,
          maintainQuestion: false,
          guardians: [],
        },
        setUserInfo: (v) => {
          const _user = get().userInfo;
          const userInfo = { ..._user, ...v };
          set(() => ({ userInfo }));
          console.log('mtvStorage put userInfo', userInfo);
          window?.mtvStorage?.put('userInfo', userInfo);
        },
        saveUserInfo: () => {
          const { userInfo } = get();
          console.log('mtvStorage put userInfo', userInfo);
          window?.mtvStorage?.put('userInfo', userInfo);
        },
        setLockStatus(b) {
          set({ lockStatus: b });
        },
        getLocalUserInfo: async () => {
          const userInfo = await window?.mtvStorage?.get('userInfo');
          console.log('获取mtvStorage的userInfo');
          console.log(window?.mtvStorage);
          console.log(userInfo);
          if (userInfo) {
            console.log('mtvStorage get userInfo', userInfo);
            set({
              userInfo,
            });
          }
        },
        setShowLogin: (v) => set(() => ({ showLogin: v })),

        logout: () => set(() => ({ bindStatus: false, showLogin: false })),
        // setBindStatus: (v) => set({ bindStatus: v }),
        // setMaintain: (v) => set(() => ({ maintain: v })),
        setCheckLoading: (v) => set(() => ({ checkLoading: v })),
        reset: () => {
          set({
            // bindStatus: false,
            showLogin: false,
            // maintain: false,
            checkLoading: false,
            lockStatus: true,
            // userLevel: 0,
            // maintainPhrase: false,
            // maintainProtector: false,
            // maintainQuestion: false,
            userInfo: {
              bindStatus: false,
              userLevel: 0,
              maintainPhrase: false,
              maintainProtector: false,
              maintainQuestion: false,
            },
          });
        },
      }),
      {
        name: 'global-store',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !['nostr', 'checkLoading', 'showLogin'].includes(key),
            ),
          ),
      },
    ),
  ),
);

// useGlobalStore.subscribe((state, prevState) => {
//   if (isEqual(state.userInfo, prevState.userInfo) || !window?.mtvStorage)
//     return;
//   const { userInfo } = state;
//   console.log('mtvStorage put userInfo', userInfo);
//   window?.mtvStorage?.put('userInfo', userInfo);
// });
