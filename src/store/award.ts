import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import account from '@/lib/account/account';
interface AwardState {
  list: any[];
  statusMap: any;
  inviteCode: string;
  getInvitationCode: () => void;
  getRewardList: () => void;
  getRewardStatusList: () => void;
  reset: () => void;
}
export const useAwardStore = create<AwardState>()(
  devtools(
    persist(
      (set, get) => ({
        list: [],
        statusMap: {},
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
        getRewardStatusList: async () => {
          const { data, code } = await account.getRewardStatusList();
          if (code === '000000') {
            const list = data?.RewardsStatus?.map((v: any) => ({
              RewardType: v.RewardType || 0,
              RewardStatus: v.RewardStatus || 0,
              Score: v.Score || 0,
            }));
            if (list?.length) {
              const _map = list.reduce((acc: any, cur: any) => {
                acc[cur.RewardType] = {
                  status: cur.RewardStatus,
                  score: cur.Score,
                };
                return acc;
              }, {});
              set({ statusMap: _map });
            }
          }
        },
        reset: async () => {
          set({ list: [], statusMap: [], inviteCode: '' });
        },
      }),
      {
        name: 'award-storage',
      },
    ),
  ),
);
