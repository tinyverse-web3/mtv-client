import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';

interface NetworkState {
  summary: any;
  ipfsList: any[];
  dkvsList: any[];
  getSummary: () => void;
  getIpfsList: () => void;
  getDkvsList: () => void;
  reset: () => void;
}
export const useNetworkStore = create<NetworkState>()(
  devtools(
    persist(
      (set, get) => ({
        summary: [],
        ipfsList: [],
        dkvsList: [],
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
        reset: async () => {
          set({ summary: [], ipfsList: [], dkvsList: [] });
        }
      }),
      {
        name: 'network-storage',
      },
    ),
  ),
);
