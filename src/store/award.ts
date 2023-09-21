import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AwardState {
  list: any[];
  getList: () => void;
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
        getList: async () => {
          // const { data, code } = await account.getAwardList();
          // if (code === '000000') {
          //   set({ list: data || [] });
          // }
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
