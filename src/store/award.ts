import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import account from '@/lib/account/account';
interface AwardState {
  list: any[];
  inviteCode: string;
  getInvitationCode: () => void;
  getRewardList: () => void;
  reset: () => void;
}
export const useAwardStore = create<AwardState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [
          {
            type: 1,
            time: 1695178772032,
            amount: 10,
            is: false,
          },
          {
            type: 2,
            time: 1695178772032,
            amount: 10,
            is: true,
          },
        ],
        inviteCode: '',
        getInvitationCode: async () => {
          const { code, data } = await account.getInvitationCode();
          if (code === '000000') {
            console.log(data);
            set({ inviteCode: data?.InvitationCode });
          }
        },
        getRewardList: async () => {
          const { data, code } = await account.getRewardList();
          if (code === '000000') {
            set({ list: data?.rewards || [] });
          }
        },
        reset: async () => {
          set({ list: [] });
        },
      }),
      {
        name: 'award-storage',
      },
    ),
  ),
);
