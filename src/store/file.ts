import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';

interface FileItem {
  Nftname: string;
  Name: string;
  DataType: string;
  Cid: string;
  Data: number | string | Date;
  Owner: string;
  Description: string;
}

interface FileState {
  securityList: any[];
  publicList: any[];
  getSecruityList: () => void;
  getPublicList: () => void;
}
export const useFileStore = create<FileState>()(
  devtools(
    persist(
      (set, get) => ({
        securityList: [],
        publicList: [],
        getSecruityList: async () => {
          const { code, msg, data } = await account.getFileList({
            type: 'security',
          });
          if (code === '000000' && data) {
            set({ securityList: data });
          }
        },
        getPublicList: async () => {
          const { code, msg, data } = await account.getFileList({
            type: 'public',
          });
          if (code === '000000') {
            set({ publicList: data });
          }
        },
      }),
      {
        name: 'file-storage',
      },
    ),
  ),
);
