import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';

export const EMPTY_GUN_NAME = 'No any gun name';
export interface GunSummy {
  key: string;
  name: string;
  expired: number;
  owner: string;
}

interface GunState {
  list: GunSummy[];
  add: (n: GunSummy) => void;
  init: (list: GunSummy[]) => void;
  remove: (id: string) => void;
  update: (note: GunSummy) => void;
  get: (gunname: string | undefined) => Promise<GunSummy | undefined>;
  load: () => void;
  apply: (gunname: any, validperiod: number) => void;
  renew: (gunname: any, validperiod: number) => Promise<boolean>;
}

export const useGunStore = create<GunState>()(
  devtools((set, get) => ({
    list: [],

    add: async (n) => {
      const list = cloneDeep(get().list);
      list.push(n);
      set({ list });
    },
    init: async (n) => {
      const list = cloneDeep(n);
      //list.length = 0;

      //list.append(n);
      set({ list });
    },
    remove: async (gunname) => {
      const list = cloneDeep(get().list);
      remove(list, (i) => i.name === gunname);
      set({ list });
    },
    update: async ({ key, ...res }) => {
      const list = cloneDeep(get().list);
      let itemIndex = list.findIndex((i) => i.key === key);
      if (itemIndex >= 0) {
        list[itemIndex] = {
          ...list[itemIndex],
          ...res,
        };
        set({ list });
      }
    },

    get: async (name) => {
      const list = get().list;
      return list.find((i) => i.name === name);
    },
    apply: async (GunName, ValidTime) => {
      console.log('ValidTime is', ValidTime);
      const { code, data, msg } = await account.applyNewGun({
        GunName,
        ValidTime: ValidTime,
      });
      if (code === '000000') {
        await get().load();

      } else {
        toast.error(msg);
        throw new Error(msg);
      }
    },

    renew: async (gunname, validperiod) => {
      console.log('Test for Apply a new GUN...');
      const GunName = gunname;
      const list = get().list;
      const summy = list.find((i) => i.name === gunname);
      if (summy == undefined) {
        return false;
      }

      const ValidTime = new Date(summy.expired);
      console.log('The GUN current ValidTime is', ValidTime);
      const newValidTime = new Date(ValidTime);
      if (validperiod == 0) {
        // valid period is 1 month
        console.log('Add 1 month...');
        newValidTime.setMonth(ValidTime.getMonth() + 1); // 延长1个月的有效期
      } else if (validperiod == 1) {
        // valid period is 1 year
        console.log('Add 1 year...');
        newValidTime.setFullYear(ValidTime.getFullYear() + 1); // 延长1年的有效期
      } else if (validperiod == 2) {
        // valid period is 2 year
        console.log('Add 2 year...');
        newValidTime.setFullYear(ValidTime.getFullYear() + 2); // 延长2年的有效期
      }

      //ValidTime.setDate(today.getDate() + 100);  // 1 day valid

      console.log('New ValidTime is', newValidTime);
      //const unixTime = ValidTime.getTime() / 1000;
      const unixTimeInSeconds = Math.floor(newValidTime.getTime() / 1000);
      console.log('newValidTime unix is', unixTimeInSeconds);

      try {
        const res = await account.renewGun({
          GunName,
          ValidTime: unixTimeInSeconds,
        });

        console.log(JSON.stringify(res.data));
        return true;
      } catch (error) {
        return false;
      }
    },

    load: async () => {
      const { code, data } = await account.getGunList();
      if (code === '000000') {
        const { GunSummys } = data;
        console.log(GunSummys);
        if (GunSummys && GunSummys.length) {
          const list = GunSummys.map((v: any) => ({
            key: v.Key_Gun,
            name: v.Name,
            expired: v.ValidTime,
            owner: v.Owner,
          }));
          set({ list });
        }
      }
    },
  })),
);
