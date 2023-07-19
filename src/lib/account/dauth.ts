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
      data: {},
    });
  }
  /**
   * 验证邮箱
   */
  async verifyEmail({ account, verifyCode }: any) {
    return this.invoke({
      name: 'verify',
      data: {
        account,
        verifyCode,
      },
    });
  }
  async updatePasswordByGuardian({ account, verifyCode, password }: any) {
    return this.invoke({
      name: 'updatePasswordByGuardian',
      data: {
        account,
        verifyCode,
        password,
      },
    });
  }
  async getMnemonic() {
    return this.invoke({
      name: 'getMnemonic',
      method: 'get',
    });
  }
  async saveMnemonic() {
    return this.invoke({
      name: 'saveMnemonic',
    });
  }
  async getNotes() {
    return this.invoke({
      name: 'getNotes',
    });
  }
  async delNote({ Id }: any) {
    return this.invoke({
      name: 'delNote',
      data: {
        Id,
      },
    });
  }
  async addNote({ Title, Content }: any) {
    return this.invoke({
      name: 'addNote',
      data: {
        Title,
        Content,
      },
    });
  }
  async modifyNote({ Id, Title, Content }: any) {
    return this.invoke({
      name: 'modifyNote',
      data: {
        Id,
        Title,
        Content,
      },
    });
  }
  async getCodebookList() {
    return this.invoke({
      name: 'codebook/getList',
    });
  }
  async delCodebook({ Id }: any) {
    return this.invoke({
      name: 'codebook/del',
      data: {
        Id,
      },
    });
  }
  async addCodebook({ Title, Account, Password, Url }: any) {
    return this.invoke({
      name: 'codebook/add',
      data: {
        Title,
        Account,
        Password,
        Url,
      },
    });
  }
  async modifyCodebook({ Id, Title, Account, Password, Url }: any) {
    return this.invoke({
      name: 'codebook/modify',
      data: {
        Id,
        Title,
        Account,
        Password,
        Url,
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
  async checkPassword({ password }: any) {
    return this.invoke({
      name: 'checkPassword',
      data: { Password: password },
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
        account,
        textPrivateData,
        passwordPrivateData,
      },
    });
  }
  async retrieveAccountByMnemonic({
    mnemonic,
    textPrivateData,
    passwordPrivateData,
  }: any) {
    return this.invoke({
      name: 'retrieveAccountByMnemonic',
      data: {
        Mnemonic: mnemonic,
        TextPrivateData: textPrivateData,
        PasswordPrivateData: passwordPrivateData,
      },
    });
  }
  async getQuestions4Retrieve({ textPrivateData, passwordPrivateData }: any) {
    return this.invoke({
      name: 'getQuestions4Retrieve',
      data: {
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
  async delGuardian({ account }: any) {
    return this.invoke({
      name: 'delGuardian',
      data: {
        Account: account,
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
  async getQuestions() {
    return this.invoke({
      name: 'getQuestions',
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
  async uploadAlbum({ file }: { file: File }) {
    const formData = new FormData();
    formData.append('File', file);
    return this.invoke({
      name: 'album/upload',
      method: 'post',
      formData: formData,
    });
  }
  async getAlbumList() {
    return this.invoke({
      name: 'album/getList',
      method: 'get',
    });
  }
  async uploadFile({
    file,
    type,
    password,
  }: {
    file: File;
    type: string;
    password?: string;
  }) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Type', type);
    if (password) {
      formData.append('Password', password);
    }
    return this.invoke({
      name: 'file/upload',
      method: 'post',
      formData: formData,
    });
  }
  async getFileList({ type }: any) {
    return this.invoke({
      name: 'file/getList',
      method: 'get',
      data: {
        Type: type,
      },
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
   */
  async createContact({ destPubkey }: any) {
    return this.invoke({
      name: 'msg/createContact',
      data: {
        DestPubkey: destPubkey,
      },
    });
  }
  async getContacts() {
    return this.invoke({
      name: 'msg/getContacts',
      method: 'get',
      data: {},
    });
  }

  /**
   * 发送消息
   * @param destPubkey 目标公钥
   * @param content 内容
   */
  async sendMsg({ destPubkey, content }: any) {
    return this.invoke({
      name: 'msg/sendMsg',
      method: 'post',
      data: {
        content,
        destPubkey,
      },
    });
  }
  async setContactAlias({ destPubkey, alias }: any) {
    return this.invoke({
      name: 'msg/setContactAlias',
      method: 'post',
      data: {
        Alias: alias,
        DestPubkey: destPubkey,
      },
    });
  }

  /**
   * 获取消息
   * @param destPubkey 目标公钥
   */
  async receiveMsgs({ destPubkey }: any) {
    return this.invoke({
      name: 'msg/receiveMsgs',
      method: 'get',
      data: {
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
      name: 'msg/getAllMsgs',
      method: 'post',
      data: {
        destPubkey,
      },
    });
  }
  async applyNewGun({
    GunName,
    ValidTime,
  }: {
    GunName: string;
    ValidTime: any;
  }) {
    return this.invoke({
      name: 'gun/applyGun',
      method: 'post',
      data: {
        gunname: GunName,
        validtime: ValidTime,
      },
    });
  }

  async renewGun({ GunName, ValidTime }: { GunName: string; ValidTime: any }) {
    return this.invoke({
      name: 'gun/renewGun',
      method: 'post',
      data: {
        gunname: GunName,
        validtime: ValidTime,
      },
    });
  }

  async getGun({ GunName }: { GunName: string }) {
    return this.invoke({
      name: 'gun/getGunDetails',
      method: 'post',
      data: {
        gunname: GunName,
      },
    });
  }

  async getGunList() {
    return this.invoke({
      name: 'gun/getGunList',
      method: 'post',
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
