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
    return this.invoke({
      name: 'sendVerifyCode',
      data: {
        account,
        type,
      },
    });
  }
  /**
   * 生成个人特征数据
   */
  async generateFeatureData({ type = 'text', content }: any) {
    return this.invoke({
      name: 'generateFeatureData',
      data: {
        type,
        content,
      },
    });
  }

  async savePassword({ publicKey, password }: any) {
    return this.invoke({
      name: 'savePassword',
      data: {
        publicKey,
        password,
      },
    });
  }
  async updateName({ publicKey, name }: any) {
    return this.invoke({
      name: 'updateName',
      data: {
        publicKey,
        account: name,
      },
    });
  }
  async getPassword({ account, verifyCode }: any) {
    return this.invoke({
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
  async addGuardian({
    privateData,
    publicKey,
    account,
    verifyCode,
    type = 'email',
  }: any) {
    return this.invoke({
      name: 'addGuardian',
      data: {
        publicKey,
        account,
        verifyCode,
        type,
        privateData,
      },
    });
  }
  async delGuardian({ privateData, account, publicKey }: any) {
    return this.invoke({
      name: 'delGuardian',
      data: {
        account,
        publicKey,
        privateData,
      },
    });
  }
  async getUserInfo({ publicKey }: any) {
    return this.invoke({
      name: 'getUserInfo',
      data: {
        publicKey,
      },
    });
  }

  async saveSssData({ publicKey, sssData, privateData, type }: any) {
    return this.invoke({
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
  async saveSssDataForUser({
    publicKey,
    sssData,
    type,
    question,
    answer,
    privateData,
  }: any) {
    return this.invoke({
      name: 'saveSssDataForUser',
      data: {
        publicKey,
        sssData,
        question,
        answer,
        privateData,
        appName: this.app,
        type,
      },
    });
  }
  async getSssDataForUser({
    publicKey,
    type,
    question,
    answer,
    privateData,
  }: any) {
    return this.invoke({
      name: 'getSssDataForUser',
      data: {
        publicKey,
        question,
        answer,
        privateData,
        appName: this.app,
        type,
      },
    });
  }
  async getSssData({ privateData, account, verifyCode, type }: any) {
    return this.invoke({
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
    return this.invoke({
      name: 'getTmpQuestions',
      data: {
        type,
      },
    });
  }
  async saveQuestions({ privateData, publicKey, questions }: any) {
    return this.invoke({
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
    return this.invoke({
      name: 'getQuestions',
      data: {
        privateData,
        appName,
        publicKey,
      },
    });
  }
  async put({ key, value, duration }: any) {
    if (value === null || value === undefined) {
      return;
    }
    const _data = await this.crypto.encrypt(JSON.stringify(value));
    return this.invoke({
      name: 'put',
      data: {
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
    return this.invoke({
      name: 'uploadFile',
      method: 'post',
      formData: formData,
    });
  }
  async uploadIpfsContent({ content }: { content: string }) {
    return this.invoke({
      name: 'uploadContent',
      method: 'post',
      data: {
        content,
      },
    });
  }
  async getFriens({ publicKey }: any) {
    return this.invoke({
      name: 'getFriens',
      method: 'post',
      data: {
        appName: this.app,
        publicKey,
      },
    });
  }
  async publishMsg({ destMsgPubkey, publicKey }: any) {
    return this.invoke({
      name: 'publishMsg',
      method: 'post',
      data: {
        appName: this.app,
        destMsgPubkey,
        publicKey,
      },
    });
  }
  async unpublishMsg({ destMsgPubkey, publicKey }: any) {
    return this.invoke({
      name: 'unpublishMsg',
      method: 'post',
      data: {
        appName: this.app,
        destMsgPubkey,
        publicKey,
      },
    });
  }
  async sendMsg({ destMsgPubkey, content }: any) {
    return this.invoke({
      name: 'sendMsg',
      method: 'post',
      data: {
        appName: this.app,
        content,
        destMsgPubkey,
      },
    });
  }
  async getMsgs({ destMsgPubkey }: any) {
    return this.invoke({
      name: 'getMsgs',
      method: 'post',
      data: {
        appName: this.app,
        destMsgPubkey,
      },
    });
  }
  async getAllMsgs({ destMsgPubkey }: any) {
    return this.invoke({
      name: 'getAllMsgs',
      method: 'post',
      data: {
        appName: this.app,
        destMsgPubkey,
      },
    });
  }
  async startMsgService({ privateKeyHash, publicKey }: any) {
    return this.invoke({
      name: 'startMsgService',
      method: 'post',
      data: {
        appName: this.app,
        privateKey: privateKeyHash,
        publicKey,
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
    const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
    const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
    const url = `${apiHost}/sdk/${name}`;
    if (formData) {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      console.log(url);
      return this.request({ url, method, data: formData, headers });
    } else {
      data.appName = this.app;
      return this.request({ url, method, data });
    }
  }
  async request({ url, method, data, params, headers }: any) {
    return axios({ url, method, data, params, headers });
  }
}
