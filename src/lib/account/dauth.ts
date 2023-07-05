import axios from 'axios';

export class Dauth {
  private readonly app;
  constructor(app = 'mtv') {
    this.app = app;
  }
  /**
   * 创建账户
   */
  async createMasterAccount() {
    return this.invoke({
      name: 'createMasterAccount',
      data: {
        appName: this.app,
      },
    });
  }
  /**
   * 验证邮箱
   */
  async verifyEmail({ account, verifyCode }: any) {
    return this.invoke({
      name: 'verify',
      data: {
        appName: this.app,
        account,
        verifyCode,
      },
    });
  }
  /**
   * 获取远程账户信息
   */
  async getAccountInfo() {
    return this.invoke({
      name: 'getAccountInfo',
      data: {},
    });
  }
  async cleanLocalAccount() {
    return this.invoke({
      name: 'cleanLocalAccount',
      data: {},
    });
  }
  async hasPassword() {
    return this.invoke({
      name: 'hasPassword',
      data: {},
    });
  }
  async updatePassword({ oldPassword, newPassword }: any) {
    return this.invoke({
      name: 'updatePassword',
      data: {
        oldPassword,
        newPassword,
      },
    });
  }
  async lock() {
    return this.invoke({
      name: 'lock',
      data: {},
    });
  }
  async unlock(password: string) {
    return this.invoke({
      name: 'unlock',
      data: {
        password,
      },
    });
  }
  async hasLocalAccount() {
    return this.invoke({
      name: 'hasLocalAccount',
      data: {},
    });
  }
  /**
   * 获取本地账户信息
   */
  async loadLocalAccount() {
    return this.invoke({
      name: 'loadLocalAccount',
      data: {},
    });
  }
  /**
   * 验证邮箱
   */
  async retrieveAccountByGuardian({
    account,
    textPrivateData,
    passwordPrivateData,
  }: any) {
    return this.invoke({
      name: 'retrieveAccountByGuardian',
      data: {
        appName: this.app,
        account,
        textPrivateData,
        passwordPrivateData,
      },
    });
  }
  async getQuestions4Retrieve({
    textPrivateData,
    passwordPrivateData,
  }: any) {
    return this.invoke({
      name: 'getQuestions4Retrieve',
      data: {
        appName: this.app,
        textPrivateData,
        passwordPrivateData,
      },
    });
  }
  async retrieveAccountBySmartPrivacy({ questions }: any) {
    return this.invoke({
      name: 'retrieveAccountBySmartPrivacy',
      data: {
        questions,
      },
    });
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
  async generateFeatureData({ textPrivateData, passwordPrivateData }: any) {
    return this.invoke({
      name: 'generateFeatureData',
      data: {
        textPrivateData,
        passwordPrivateData,
      },
    });
  }

  /**
   * 保存密码
   * @param publicKey 公钥
   * @param password 密码
   */
  async savePassword({ publicKey, password }: any) {
    return this.invoke({
      name: 'savePassword',
      data: {
        publicKey,
        password,
      },
    });
  }
  /**
   * 更新用户名称
   * @param publicKey 公钥
   * @param name 用户名称
   */
  async updateName({ publicKey, name }: any) {
    return this.invoke({
      name: 'updateName',
      data: {
        publicKey,
        account: name,
      },
    });
  }
  /**
   * 获取密码
   * @param account 账户
   * @param verifyCode 验证码
   */
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
   * @param privateData 私有数据
   * @param publicKey 公钥
   * @param account 账户
   * @param verifyCode 验证码
   * @param type 类型
   */
  async addGuardian({ account, verifyCode, type = 'email' }: any) {
    return this.invoke({
      name: 'addGuardian',
      data: {
        account,
        verifyCode,
        type,
      },
    });
  }
  /**
   * 删除守护者
   * @param privateData 私有数据
   * @param account 账户
   * @param publicKey 公钥
   */
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
  /**
   * 获取用户信息
   * @param publicKey 公钥
   */
  async getUserInfo({ publicKey }: any) {
    return this.invoke({
      name: 'getUserInfo',
      data: {
        publicKey,
      },
    });
  }

  /**
   * 保存 SSS 数据
   * @param publicKey 公钥
   * @param sssData SSS 数据
   * @param privateData 私有数据
   * @param type 类型
   */
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

  /**
   * 保存用户 SSS 数据
   * @param publicKey 公钥
   * @param sssData SSS 数据
   * @param type 类型
   * @param question 问题
   * @param answer 答案
   * @param privateData 私有数据
   */
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

  /**
   * 获取用户 SSS 数据
   * @param publicKey 公钥
   * @param type 类型
   * @param question 问题
   * @param answer 答案
   * @param privateData 私有数据
   */
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

  /**
   * 获取 SSS 数据
   * @param privateData 私有数据
   * @param account 账户
   * @param verifyCode 验证码
   * @param type 类型
   */
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
   * @param type 问题模版类型，其中1表示默认问题模版，2表示自定义问题模版
   */
  async getTmpQuestions({ type }: { type: 1 | 2 }) {
    return this.invoke({
      name: 'getTmpQuestions',
      data: {
        type,
      },
    });
  }

  /**
   * 保存问题
   * @param privateData 私有数据
   * @param publicKey 公钥
   * @param questions 问题
   */
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
   * @param privateData 私有数据
   * @param appName 应用名称
   * @param publicKey 公钥
   */
  async getQuestions({ privateData, appName = 'mtv', publicKey }: any) {
    return this.invoke({
      name: 'getQuestions',
      data: {
      },
    });
  }

  /**
   * 存储数据
   * @param key 键
   * @param value 值
   * @param duration 持续时间
   */
  async put({ key, value, duration }: any) {
    if (value === null || value === undefined) {
      return;
    }
    return this.invoke({
      name: 'kv/get',
      data: {
        key: `/service/dauth/${key}`,
        value: value,
        duration,
      },
    });
  }

  /**
   * 获取数据
   * @param key 键
   */
  async get({ key }: any) {
    const res = await this.invoke({
      name: 'kv/get',
      data: {
        key: `/service/dauth/${key}`,
      },
    });
    let result;
    const { code, data } = res.data;
    return data;
  }

  /**
   * 上传 IPFS 文件
   * @param file 文件
   */
  async uploadIpfsFile({ file }: { file: File }) {
    const formData = new FormData();
    formData.append('file', file);
    return this.invoke({
      name: 'ipfs/uploadFile',
      method: 'post',
      formData: formData,
    });
  }
  async uploadAvatar({ file }: { file: File }) {
    const formData = new FormData();
    formData.append('file', file);
    return this.invoke({
      name: 'uploadAvatar',
      method: 'post',
      formData: formData,
    });
  }

  /**
   * 上传 IPFS 内容
   * @param content 内容
   */
  async uploadIpfsContent({ content }: { content: string }) {
    return this.invoke({
      name: 'ipfs/uploadContent',
      method: 'post',
      data: {
        content,
      },
    });
  }

  /**
   * 获取联系人列表
   * @param publicKey 公钥
   */
  async getContacts({ publicKey }: any) {
    return this.invoke({
      name: 'getContacts',
      method: 'get',
      data: {
        appName: this.app,
        publicKey,
      },
    });
  }
  /**
   * 获取聊天消息
   * @param destPubkey 公钥
   */
  async receiveMsgs({ destPubkey }: any) {
    return this.invoke({
      name: 'receiveMsgs',
      method: 'get',
      data: {
        appName: this.app,
        destPubkey,
      },
    });
  }

  /**
   * 发布消息
   * @param destPubkey 目标公钥
   * @param publicKey 公钥
   */
  async publishMsg({ destPubkey, publicKey }: any) {
    return this.invoke({
      name: 'publishMsg',
      method: 'post',
      data: {
        appName: this.app,
        destPubkey,
        publicKey,
      },
    });
  }

  /**
   * 取消发布消息
   * @param destPubkey 目标公钥
   * @param publicKey 公钥
   */
  async unpublishMsg({ destPubkey, publicKey }: any) {
    return this.invoke({
      name: 'unpublishMsg',
      method: 'post',
      data: {
        appName: this.app,
        destPubkey,
        publicKey,
      },
    });
  }

  /**
   * 发送消息
   * @param destPubkey 目标公钥
   * @param content 内容
   */
  async sendMsg({ destPubkey, content }: any) {
    return this.invoke({
      name: 'sendMsg',
      method: 'post',
      data: {
        appName: this.app,
        content,
        destPubkey,
      },
    });
  }

  /**
   * 获取消息
   * @param destPubkey 目标公钥
   */
  async getMsgs({ destPubkey }: any) {
    return this.invoke({
      name: 'getMsgs',
      method: 'post',
      data: {
        appName: this.app,
        destPubkey,
      },
    });
  }

  /**
   * 获取所有消息
   * @param destPubkey 目标公钥
   */
  async getAllMsgs({ destPubkey }: any) {
    return this.invoke({
      name: 'getAllMsgs',
      method: 'post',
      data: {
        appName: this.app,
        destPubkey,
      },
    });
  }

  /**
   * 开始消息服务
   * @param privateKeyHash 私钥哈希
   * @param publicKey 公钥
   */
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

  /**
   * 调用接口
   * @param name 接口名称
   * @param data 数据
   * @param method 请求方法
   * @param formData 表单数据
   */
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
      if (method === 'get') {
        return this.request({
          url,
          method,
          params: { ...data, timestamp: +new Date() },
        });
      } else {
        return this.request({ url, method, data });
      }
    }
  }

  /**
   * 发送请求
   * @param url 请求地址
   * @param method 请求方法
   * @param data 数据
   * @param params 参数
   * @param headers 请求头
   */
  async request({ url, method, data, params, headers }: any) {
    return axios({ url, method, data, params, headers, timeout: 30000 });
  }
}
