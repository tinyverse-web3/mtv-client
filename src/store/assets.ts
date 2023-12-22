import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';

interface NftItem {
  Nftname: string;
  Name: string;
  DataType: string;
  Cid: string;
  Data: number | string | Date;
  Owner: string;
  Description: string;
}
export interface ReceiveItem {
  receiver: string;
  amount: number;
}
export interface TvsTxItem {
  amount: number;
  comment: string;
  gas: number;
  receivers: ReceiveItem[];
  sender: string;
  transferName: 'tvs';
  txAddr: string;
  txTime: Date | number;
  type: 0 | 1;
}
interface AssetsState {
  nftList: NftItem[];
  tvs: number;
  tvsTxList: TvsTxItem[];
  currentTx?: TvsTxItem;
  toAddress: string;
  getNftList: () => void;
  setTvsTxList: (list: any[]) => void;
  setTvs: (n: number) => void;
  setTvsTx: (n: TvsTxItem) => void;
  setToAddress: (n: string) => void;
  reset: () => void;
}
export const useAssetsStore = create<AssetsState>()(
  devtools(
    persist(
      (set, get) => ({
        nftList: [
          // {
          //   Nftname:
          //     '659f0ecbdfcad86b50c02176f978836ab33707d512f7855fab7e840974675cf5',
          //   Name: 'IMG_20230801_175247.PNG',
          //   DataType: 'GUN',
          //   Cid: 'QmfUM8m4sZrRxwkdYEzL29Yj8UwSCmyx1ZQ5TnkPFfnKe6',
          //   Data: null,
          //   Owner: 'CAESIOhjkWkNhpuTxoCjwmVl8dALULDJDrhP9r6ZdqVj4dKO',
          //   Description: 'IMG_20230801_175247.PNG',
          // },
        ],
        currentTx: undefined,
        tvs: 0,
        tvsTxList: [],
        toAddress: '',
        setTvsTxList: (list) => {
          set({ tvsTxList: list });
        },
        setTvs: (n) => {
          set({ tvs: n });
        },
        setTvsTx: (n) => {
          set({ currentTx: n });
        },
        setToAddress: (n) => {
          set({ toAddress: n });
        },
        getNftList: async () => {
          const { data, code } = await account.getNftList();
          console.log(data);
          if (code === '000000') {
            set({ nftList: data || [] });
          }
        },
        reset: async () => {
          set({
            nftList: [],
            currentTx: undefined,
            tvs: 0,
            tvsTxList: [],
            toAddress: '',
          });
        },
      }),
      {
        name: 'assets-storage',
      },
    ),
  ),
);
