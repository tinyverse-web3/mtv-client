import axios from 'axios';

export class GunRequest {

  async applyNewGun({ GunName, ValidTime }: { GunName : string, ValidTime : any }) {
    return this.invoke({
      name: 'applygun',
      method: 'post',
      data: {
        gunname: GunName,
        validtime: ValidTime
      },
    });
  }

  
  async renewGun({ GunName, ValidTime }: { GunName : string, ValidTime : any }) {
    return this.invoke({
      name: 'renewgun',
      method: 'post',
      data: {
        gunname: GunName,
        validtime: ValidTime
      },
    });
  }

  async getGun({ GunName }: { GunName : string}) {
    return this.invoke({
      name: 'getgundetails',
      method: 'post',
      data: {
        gunname: GunName,
      },
    });
  }

  async getGunList() {
    return this.invoke({
      name: 'getgunlist',
      method: 'post',
    });
  }


  async invoke({
    name,
    data = {},
    method = 'post',
  }: {
    name: string;
    data?: Record<string, any>;
    method?: string;
  }) {
    const { VITE_SDK_LOCAL_HOST } = import.meta.env;
    const apiHost = VITE_SDK_LOCAL_HOST;
    const url = `${apiHost}/sdk/gun/${name}`;
    //const url = `${apiHost}/sdk/getUserInfo`;

      return this.request({ url, method, data });
  }
  async request({ url, method, data, params, headers }: any) {
    return axios({ url, method, data, params, headers });
    /*
    return axios
      .post(url, data)
      .then((res) => {
        if(res.data.code  == '000000' ){
          return res.data.data;
        }
        //logger.error(res.data.msg);
        throw new Error(res.data.msg);
      })
      .catch((err) => {
        //logger.error(err);
        throw err;
      });
      */

  }


}
