import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';

interface NetworkState {
  summary: any;
  status: 0 | 1 | 2;
  ipfsList: any[];
  dkvsList: any[];
  setStatus: (s: 0 | 1| 2) => void;
  getSummary: () => void;
  getIpfsList: () => void;
  getDkvsList: () => void;
}
export const useNetworkStore = create<NetworkState>()(
  devtools(
    persist(
      (set, get) => ({
        status: 0,
        summary: [],
        ipfsList: [],
        dkvsList: [],
        setStatus: (s: 0 | 1 | 2) => {
          set({ status: s });
        },
        getSummary: async () => {
          const { data = [], code, msg } = await account.getDataSummary();
          if (code === '000000') {
            set({ summary: data });
          }
        },
        getIpfsList: async () => {
          const { data = [], code, msg } = await account.getDataList('ipfs');
          if (code === '000000') {
            set({ ipfsList: data });
          }
        },
        getDkvsList: async () => {
          const { data = [], code, msg } = await account.getDataList('dkvs');
          if (code === '000000') {
            set({ dkvsList: data });
          }
        },
      }),
      {
        name: 'network-storage',
      },
    ),
  ),
);
