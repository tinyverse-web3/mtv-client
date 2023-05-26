import axios from 'axios';

export class Dauth {
  private readonly app;
  private crypto: any;
  constructor(app = 'mtv') {
    this.app = app;
  }
  init(crypto: any) {
    this.crypto = crypto;
  }
  /**
   * 发送验证码
   */
  async sendVerifyCode({ account, type = 'email' }: any) {
    return await this.invoke({
      name: 'sendVerifyCode',
      data: {
        account,
        type,
      },
    });
  }

  async savePassword({ publicKey, password }: any) {
    return await this.invoke({
      name: 'savePassword',
      data: {
        publicKey,
        password,
      },
    });
  }
  async updateName({ publicKey, name }: any) {
    return await this.invoke({
      name: 'updateName',
      data: {
        publicKey,
        account: name,
      },
    });
  }
  async getPassword({ account, verifyCode }: any) {
    return await this.invoke({
      name: 'getPassword',
      data: {
        account,
        verifyCode,
      },
    });
  }
  /**
   * 添加守护者
   */
  async addGuardian({ publicKey, account, verifyCode, type = 'email' }: any) {
    return await this.invoke({
      name: 'addGuardian',
      data: {
        publicKey,
        account,
        verifyCode,
        type,
      },
    });
  }
  async delGuardian({ account, publicKey }: any) {
    return await this.invoke({
      name: 'delGuardian',
      data: {
        account,
        publicKey,
      },
    });
  }
  async getUserInfo({ publicKey }: any) {
    return await this.invoke({
      name: 'getUserInfo',
      data: {
        publicKey,
      },
    });
  }

  async saveSssData({ publicKey, sssData, privateData, type }: any) {
    return await this.invoke({
      name: 'saveSssData',
      data: {
        publicKey,
        sssData,
        privateData,
        appName: this.app,
        type,
      },
    });
  }
  async getSssData({ privateData, account, verifyCode, type }: any) {
    return await this.invoke({
      name: 'getSssData',
      data: {
        privateData,
        appName: this.app,
        account,
        verifyCode,
        type,
      },
    });
  }
  /**
   * 获取问题模版列表
   * @param 问题模版类型，其中1表示默认问题模版，2表示自定义问题模版
   */
  async getTmpQuestions({ type }: { type: 1 | 2 }) {
    return await this.invoke({
      name: 'getTmpQuestions',
      data: {
        type,
      },
    });
  }
  async saveQuestions({ privateData, publicKey, questions }: any) {
    return await this.invoke({
      name: 'saveQuestions',
      data: {
        privateData,
        appName: this.app,
        publicKey,
        questions,
      },
    });
  }
  /**
   * 获取问题表
   */
  async getQuestions({ privateData, appName = 'mtv', publicKey }: any) {
    return await this.invoke({
      name: 'getQuestions',
      data: {
        privateData,
        appName,
        publicKey,
      },
    });
  }
  async put({ privateData, key, value, duration }: any) {
    if (value === null || value === undefined) {
      return;
    }
    const _data = await this.crypto.encrypt(JSON.stringify(value));
    return await this.invoke({
      name: 'put',
      data: {
        privateData,
        key: `/service/dauth/${key}`,
        value: _data,
        duration,
      },
    });
  }
  async get({ key }: any) {
    const res = await this.invoke({
      name: 'get',
      data: {
        key: `/service/dauth/${key}`,
      },
    });
    let result;
    const { code, data } = res.data;
    if (code === '000000' && data !== null && data !== undefined) {
      try {
        result = await this.crypto.decrypt(data);
        result = JSON.parse(result);
      } catch (error) {
        console.log('获取dauth 数据失败');
        console.log(error);
      }
    }
    return result;
  }
  async uploadIpfsFile({ file }: { file: File }) {
    const formData = new FormData();
    formData.append('file', file);
    return await this.invoke({
      name: 'uploadFile',
      method: 'post',
      formData: formData,
    });
  }
  async uploadIpfsContent({ content }: { content: string }) {
    return await this.invoke({
      name: 'uploadContent',
      method: 'post',
      data: {
        content,
      },
    });
  }
  async invoke({
    name,
    data = {},
    method = 'post',
    formData,
  }: {
    name: string;
    data?: Record<string, any>;
    method?: string;
    formData?: any;
  }) {
    const url = `http://192.168.2.121:8888/sdk/${name}`;
    if (formData) {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      console.log(url);
      return await this.request({ url, method, data: formData, headers });
    } else {
      data.appName = this.app;
      return await this.request({ url, method, data });
    }
  }
  async request({ url, method, data, params, headers }: any) {
    return await axios({ url, method, data, params, headers });
  }
}
