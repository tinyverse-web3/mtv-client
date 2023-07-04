import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { remove, cloneDeep } from 'lodash';
import {GunRequest} from './gunrequest';


export const EMPTY_GUN_NAME = "No any gun name";
export interface GunSummy {
  key: string;
  name: string;
  expired: Date | number;
  owner:string
}

interface GunState {
  list: GunSummy[];
  add: (note: GunSummy) => void;
  init: (list: GunSummy[]) => void;
  remove: (id: string) => void;
  update: (note: GunSummy) => void;
  get: (gunname: string | undefined) => Promise<GunSummy | undefined>;
  load: () => Promise<GunSummy[]>;
  apply: (gunname: any, validperiod:number) => Promise<string>;
  renew: (gunname: any, validperiod:number) => Promise<boolean>;
}

/*
const summyGoogle : GunSummy = {
  key: "/gun/mtv/Google",
  name: "Google1",
  expired: 1686141231000,
  owner:"08011220dfda46b9376a8103ae5d3b575c603997f4b2879da2bf50b6c3ce3c62ed5d73d5"
};

const summyMicrosoft : GunSummy = {
  key: "/gun/mtv/Microsoft",
  name: "Microsoft2",
  expired: 1686241231000,
  owner:"08011220dfda46b9376a8103ae5d3b575c603997f4b2879da2bf50b6c3ce3c62ed5d73d5"
};
const summyHuawei : GunSummy = {
  key: "/gun/mtv/Huawei",
  name: "Huawei3",
  expired: 1686541231000,
  owner:"08011220dfda46b9376a8103ae5d3b575c603997f4b2879da2bf50b6c3ce3c62ed5d73d5"
};
*/

export const useGunList = create<GunState>()(
  devtools(
    (set, get) => ({
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
      apply: async (gunname, validperiod) => {
        console.log("Test for Apply a new GUN...");
         const gunrequest = new GunRequest();
        const GunName = gunname;
        const today = new Date();
        const ValidTime = new Date();
        if (validperiod == 0) {
          // valid period is 1 month
          console.log("Add 1 month...");
          ValidTime.setMonth(today.getMonth() + 1);  // 1个月的有效期
        }
        else if (validperiod == 1) {
          // valid period is 1 year
          console.log("Add 1 year...");
          ValidTime.setFullYear(today.getFullYear() + 1);  // 1年的有效期
        } 
        else if (validperiod == 2) {
          // valid period is 2 year
          console.log("Add 2 year...");
          ValidTime.setFullYear(today.getFullYear() + 2);  // 2年的有效期
        }

        //ValidTime.setDate(today.getDate() + 100);  // 1 day valid

        console.log("ValidTime is", ValidTime);
        //const unixTime = ValidTime.getTime() / 1000;
        const unixTimeInSeconds = Math.floor(ValidTime.getTime() / 1000);
        console.log("ValidTime unix is", unixTimeInSeconds);
        
        try {
          const res = await gunrequest.applyNewGun({
            GunName,
            ValidTime: unixTimeInSeconds
          });

          console.log(JSON.stringify(res.data));
          const result = JSON.stringify(res.data.data.gundetails);
          const gundetailsContent = JSON.parse(result);
          return gundetailsContent.Gun_Name;
        } catch (error) {
      console.log("the result parse error");
          return "";
        }
      },

      renew: async (gunname, validperiod) => {
        console.log("Test for Apply a new GUN...");
        const GunName = gunname;
         const gunrequest = new GunRequest();
         const list = get().list;
        const summy = list.find((i) => i.name === gunname);
        if (summy == undefined) {
          return false;
        }
          
        const ValidTime = new Date(summy.expired);
        console.log("The GUN current ValidTime is", ValidTime);
        const newValidTime = new Date(ValidTime);
        if (validperiod == 0) {
          // valid period is 1 month
          console.log("Add 1 month...");
          newValidTime.setMonth(ValidTime.getMonth() + 1);  // 延长1个月的有效期
        }
        else if (validperiod == 1) {
          // valid period is 1 year
          console.log("Add 1 year...");
          newValidTime.setFullYear(ValidTime.getFullYear() + 1);  // 延长1年的有效期
        } 
        else if (validperiod == 2) {
          // valid period is 2 year
          console.log("Add 2 year...");
          newValidTime.setFullYear(ValidTime.getFullYear() + 2);  // 延长2年的有效期
        }

        //ValidTime.setDate(today.getDate() + 100);  // 1 day valid

        console.log("New ValidTime is", newValidTime);
        //const unixTime = ValidTime.getTime() / 1000;
        const unixTimeInSeconds = Math.floor(newValidTime.getTime() / 1000);
        console.log("newValidTime unix is", unixTimeInSeconds);
        
        try {
          const res = await gunrequest.renewGun({
            GunName,
            ValidTime: unixTimeInSeconds
          });

          console.log(JSON.stringify(res.data));
          return true;
        } catch (error) {
          return false;
        }
      },

      load: async () => {
        const list = cloneDeep(get().list);
        list.length = 0;// Clear all data, and fill new data

        const gunrequest = new GunRequest();

        console.log("Will request gun list 0");

        const data = await gunrequest.getGunList();

        console.log("Will request gun list done");
        console.log("The response", JSON.stringify(data.data.data.GunSummys));
        //const list_xml = JSON.parse(data.data) as string;
        console.log("data is ",data);
        //console.log("The xml list is", list_xml);
        try {
          const result = JSON.stringify(data.data.data.gunlist);

          const gunlistContent = JSON.parse(data.data.data.gunlist);

          console.log("The Parsed content is", gunlistContent);

          if (gunlistContent.GunSummys.length > 0) {
             const summyList = gunlistContent.GunSummys;
             console.log("summyList is", summyList);
            for (let i = 0; i < summyList.length; i++) {
              const summy: GunSummy = {
                key: summyList[i].Key_Gun,
                name: summyList[i].Name,
                expired:summyList[i].ValidTime,
            owner: summyList[i].Owner,
              };

              list.push(summy)
            }
          }

        //console.log(array[i]);
        } catch (error) {
          console.log("The Parse error is", error); 
        }

        set({ list });

        if (list.length > 0) {
          return list;
        }
        // Empty list , show a empty list
        const summy: GunSummy = {
          key: "",
          name: EMPTY_GUN_NAME,
          expired:0,
          owner: "",
        };

        list.push(summy)

        return list;
      }
    }),
  ),
);


/*
async function getGunList() {
 
  const axios = require('axios');

  axios.get('https://jsonplaceholder.typicode.com/posts')
   .then((response: { data: any; }) => {
      console.log(response.data);
    })
   .catch((error: any) => {
      console.log(error);
    });
}

private async getGunDetails(gunname: string) {
  const httpConfig = {
    headers: {

      'Content-Type': 'application/json;charset=UTF-8'
    },
  };
  const getKeyUrl =
    config.kv.key_server_url + config.kv.get_key_url + key;
    logger.info("getKey key: " + key);
  return axios
    .get(getKeyUrl, httpConfig)
    .then((res: { data: { code: string; data: string; msg: string | undefined; }; }) => {
      if(res.data.code  == '000000' ){
        logger.info("getKey value: " + res.data.data);
        return res.data.data;
      }
      throw new Error(res.data.msg);
    })
    .catch((err: any) => {
      logger.error(err);
      throw err;
    });
}
*/