import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import i18n from '@/locales';
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
  renew: (gunname: any, validperiod: number) => void;
  reset: () => void;
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
        toast.success(i18n.t('pages.space.gun.apply_success'));
      } else {
        toast.error(msg);
        throw new Error(msg);
      }
    },

    renew: async (gunname, unixTimeInSeconds) => {
      console.log('Test for Apply a new GUN...');
      const GunName = gunname;
      const { code, data, msg } = await account.renewGun({
        GunName,
        ValidTime: unixTimeInSeconds,
      });
      if (code === '000000') {
        await get().load();
        toast.success(i18n.t('pages.space.gun.renew_success'));
      } else {
        toast.error(msg);
        throw new Error(msg);
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
    reset: () => {
      set({ list: [] });
    },
  })),
);
