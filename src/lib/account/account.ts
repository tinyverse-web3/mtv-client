import { Password } from './wallet';
import { Dauth } from './dauth';
import axios from 'axios';
export enum STATUS_CODE {
  EMPTY_PASSWORD,
  EMPTY_INPUT,
  INVALID_PASSWORD,
  EMPTY_KEYSTORE,
  SUCCESS,
  ERROR,
  RESTORE_ERROR,
  SHARES_ERROR,
  MODULE_INIT_ERROR,
  SAVE_PASSWOR_ERROR,
  CHANGE_PASSWORD_ERROR,
}
const LOCAL_PASSWORD_KEY = '_password';
const LOCAL_PASSWORD_SALT_KEY = '_password_salt';
const LOCAL_KEYSTORE_KEY = '_keystore';
const LOCAL_ACCOUNT_KEY = 'account';

interface Guardian {
  name: string;
  type: string;
  hash: string;
  id?: string;
}
interface NostrInfo {
  pk: string;
  sk: string;
}
interface SubAccountWeb3 {
  id: string;
  type: 'web3';
  label: string;
  remark?: string;
  category: string;
  address: string;
  publicKey?: string;
  privateKey?: string;
  mnemonic: string;
}
interface SubAccountWeb2 {
  id: string;
  type: 'web2';
  label: string;
  category: string;
  remark?: string;
  service_name: string;
  service_url: string;
  account: string;
  password: string;
}
interface SubAccountLocal {
  id: string;
  type: 'local';
  label: string;
  remark?: string;
  category: string;
  account: string;
  service_type: string;
  publicKey: string;
  privateKey: string;
}
interface PointAccount {
  type: 'point';
  label: string;
  address: string;
}
export type SubAccount = SubAccountWeb3 | SubAccountWeb2 | SubAccountLocal;
export interface AccountInfo {
  publicKey: string;
  avatar: string;
  name: string;
  address: string;
  safeLevel: number;
  bindStatus: boolean;
  isDefaultPwd: boolean;
  maintainPhrase: boolean;
  maintainProtector: boolean;
  maintainQuestion: boolean;
  privacyInfo: any;
  featureData?: any[];
  guardians: Guardian[];
  note_ipfs: string;
  subAccount: SubAccount[];
  pointAccount: PointAccount;
}

/* SafeLevel 用户等级
0级：临时账户，账户无法恢复，数据随时会丢失，请尽快做账户维护。
1级：账户存在单点故障，请尽快做账户维护。
2级：账户依赖其他账户的安全，请尽快做账户维护。
3级：低标准账户，建议提升安全级别。
4级：标准账户，您的账户已经很安全，但还有提升空间。
5级：高标准账户，您的账户已经得到完全的保护。
*/
interface Response {
  code: STATUS_CODE;
  data: any;
  msg: string;
}
export class Account {
  private readonly password = new Password();
  private readonly dauth = new Dauth();
  private getAccountStatus: boolean = false;
  private textPrivateData = '';
  private account = '';
  private passwordPrivateData = '';
  public accountInfo: AccountInfo = {
    publicKey: '',
    avatar: '',
    name: '',
    address: '',
    safeLevel: 0,
    featureData: undefined,
    bindStatus: false,
    isDefaultPwd: true,
    maintainPhrase: false,
    maintainProtector: false,
    maintainQuestion: false,
    privacyInfo: {},
    guardians: [],
    subAccount: [],
    note_ipfs: '',
    pointAccount: {
      type: 'point',
      label: 'point',
      address: '',
    },
  };
  constructor() {}
  /**
   * 创建账户
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async create() {
    return this.dauth.createMasterAccount();
  }
  async hasPassword() {
    const result = await this.dauth.hasPassword();
    return result.data.data === true;
  }
  async hasLocalAccount() {
    const result = await this.dauth.hasLocalAccount();
    return result.data.data === true;
  }
  /**
   * 验证账户
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async verifyEmail({ account, verifyCode }: any) {
    this.account = account;
    return this.dauth.verifyEmail({ account, verifyCode });
  }
  /**
   * 获取密钥信息
   * @returns {Promise<void>}
   */
  async getKeyInfo() {}

  /**
   * 获取账户信息
   * @returns {Promise<void>}
   */
  async getAccountInfo() {
    const result = await this.dauth.loadLocalAccount();
    this.getAccountStatus = true;
    const { code, data } = result.data;
    if (code === '000000') {
      return data;
    } else {
      return {};
    }
  }
  /**
   * 获取应用私有数据
   * @returns {Promise<void>}
   */
  async getAppPrivateData() {
    const privateData = '';
    // this.privateData = privateData;
  }
  /**
   * 添加子账户
   * @param sub - 子账户信息
   */
  async addSubAccount(sub: SubAccount) {
    this.accountInfo.subAccount.push(sub);
  }
  /**
   * 移除子账户
   * @param sub - 子账户信息
   */
  async deleteSubAccount(sub: SubAccount) {
    const index = this.accountInfo.subAccount.findIndex(
      (item) => item.id === sub.id,
    );
    if (index > -1) {
      this.accountInfo.subAccount.splice(index, 1);
    }
  }
  /**
   * 获取所有子账户信息
   * @returns {SubAccount[]} - 返回子账户信息数组
   */
  async getAllSubAccount(): Promise<SubAccount[]> {
    return this.accountInfo.subAccount;
  }
  /**
   * 设置私有数据
   * @param textPrivateData - 文本私有数据
   * @param passwordPrivateData - 密码私有数据
   * @param customFeatureData - 自定义特征数据
   * @returns {Promise<void>}
   */
  async setPivateData(
    textPrivateData: string,
    passwordPrivateData: string,
    customFeatureData: string,
  ) {
    const arr = [
      textPrivateData,
      passwordPrivateData,
      customFeatureData,
    ].filter(Boolean);
    const res = await this.dauth.generateFeatureData({
      textPrivateData,
      passwordPrivateData,
    });
    console.log(res);
  }
  /**
   * 恢复私有数据
   * @param textPrivateData - 文本私有数据
   * @param passwordPrivateData - 密码私有数据
   * @param customFeatureData - 自定义特征数据
   * @returns {Promise<void>}
   */
  async restorePivateData(
    textPrivateData: string,
    passwordPrivateData: string,
    customFeatureData: string,
  ) {
    const arr = [
      textPrivateData,
      passwordPrivateData,
      customFeatureData,
    ].filter(Boolean);
    const res = await this.dauth.generateFeatureData({
      textPrivateData,
      passwordPrivateData,
    });
    const { code, data } = res.data;
  }
  async getLocalPrivateData() {
    const privateData = '';
    // this.privateData = privateData;
  }
  async saveLocalPrivateData() {}
  /**
   * 获取助记词
   * @returns {string | undefined} - 返回助记词或undefined
   */
  getMnemonic() {}
  resetAccountInfo() {
    this.accountInfo = {
      publicKey: '',
      avatar: '',
      name: '',
      address: '',
      safeLevel: 0,
      featureData: undefined,
      bindStatus: false,
      isDefaultPwd: true,
      maintainPhrase: false,
      maintainProtector: false,
      maintainQuestion: false,
      privacyInfo: {},
      guardians: [],
      subAccount: [],
      note_ipfs: '',
      pointAccount: {
        type: 'point',
        label: 'point',
        address: '',
      },
    };
  }
  /**
   * 检查账户状态
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async checkStatus() {}
  /**
   * 解锁账户
   * @param password - 账户密码
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async unlock(password: string) {
    const result = await this.dauth.unlock(password);
    if (result.data.code === '000000') {
      this.getAccountInfo();
    }
    return result.data.data;
  }
  /**
   * 删除账户信息，包括密码和密钥管理器
   * @returns {Promise<void>}
   */
  async remove() {
    const result = await this.dauth.cleanLocalAccount();
    return !!result.data.data;
  }
  /**
   * 锁定账户，删除密码和重置账户信息
   * @returns {Promise<void>}
   */
  async lock() {
    await this.dauth.lock();
    this.resetAccountInfo();
    // this.mtvStorage = undefined;
    // this.crypto = undefined;
    // this.keySha = undefined;
  }
  /**
   * 恢复账户信息
   * @param password - 账户密码
   * @param phrase - 助记词
   * @param entropy - 熵
   * @param shares - 分享的密钥
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async restore({
    password,
    phrase,
    shares,
    entropy,
  }: {
    password: string;
    phrase?: string;
    entropy?: string;
    shares?: string[];
  }) {}
  /**
   * 通过守护者恢复账户信息
   * @param {Object} options - 选项对象
   * @param {string} options.account - 账户名
   * @param {string} options.textPrivateData - 文本私有数据
   * @param {string} options.passwordPrivateData - 密码私有数据
   * @returns {Promise<Object>} - 返回包含状态码和数据的对象
   */
  async restoreByGuardian({
    // account,
    textPrivateData,
    passwordPrivateData,
  }: {
    // account: string;
    textPrivateData: string;
    passwordPrivateData: string;
  }) {
    return this.dauth.retrieveAccountByGuardian({
      account: this.account,
      textPrivateData,
      passwordPrivateData,
    });
  }
  async getQuestions4Retrieve({
    // account,
    textPrivateData,
    passwordPrivateData,
  }: {
    // account: string;
    textPrivateData: string;
    passwordPrivateData: string;
  }) {
    const result = await this.dauth.getQuestions4Retrieve({
      textPrivateData,
      passwordPrivateData,
    });
    return result.data.data;
  }
  /**
   * 通过密保问题恢复账户信息
   * @param {Object} options - 选项对象
   * @param {Array} options.list - 密保问题列表
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async restoreByQuestions(list: any[], type = 1) {
    let serverList = [];
    if (type == 1) {
      serverList = list.map((val) => ({
        Content: val.list.map((s: any) => ({
          Content: s.q,
          Characters: s.l,
          Answer: s.a,
        })),
        Title: val.title,
        Type: type,
      }));
    } else {
      let _list = list;
      _list = _list.map((v, i) => {
        return {
          id: i,
          list: v.list.filter((s: any) => s.a),
          title: v.title,
        };
      });
      _list = _list.filter((v) => v.list.length);

      serverList = _list.map((val) => ({
        Content: val.list.map((s: any) => ({
          Content: s.q,
          Characters: s.l,
          Answer: s.a,
        })),
        Title: val.title,
        Type: type,
      }));
    }
    await this.dauth.retrieveAccountBySmartPrivacy({
      questions: serverList,
    });
  }
  /**
   * 发送验证码
   * @param {Object} options - 选项对象
   * @param {string} options.type - 验证码类型
   * @param {string} options.account - 账户名
   * @returns {Promise<Object>} - 返回包含状态码和数据的对象
   */
  async sendVerifyCode({ type, account }: any) {
    return await this.dauth.sendVerifyCode({ account, type });
  }

  /**
   * 添加守护者
   * @param {Object} options - 选项对象
   * @param {string} options.account - 守护者账户名
   * @param {string} options.verifyCode - 验证码
   * @param {string} options.type - 守护者类型
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async addGuardian({
    account,
    verifyCode,
    type = 'email',
  }: {
    account: string;
    verifyCode: string;
    type?: string;
  }) {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.addGuardian({
      account,
      verifyCode,
      type,
    });
  }
  /**
   * 删除守护者
   * @param {Object} options - 选项对象
   * @param {string} options.account - 守护者账户名
   * @param {string} options.type - 守护者类型
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async delGuardian({
    account,
    type = 'email',
  }: {
    account: string;
    type?: string;
  }) {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.delGuardian({
      publicKey,
      account,
      privateData: this.accountInfo.featureData,
    });
    console.log(res);
    console.log(this.accountInfo);
    if (res.data.code === '000000') {
      const index = this.accountInfo.guardians.findIndex(
        (v) => v.name === account,
      );
      if (index > -1) {
        this.accountInfo.guardians.splice(index, 1);
        console.log(this.accountInfo);
      }
      return STATUS_CODE.SUCCESS;
    }
    return res;
  }
  /**
   * 通过助记词备份账户信息
   * @returns {Promise<void>} - 无返回值
   */
  async backupByPharse() {
    this.accountInfo.maintainPhrase = true;
  }

  /**
   * 备份守护者
   * @returns {Promise<void>} - 无返回值
   */
  async backupByGuardian() {}

  /**
   * 获取问题模板
   * @param {number} type - 问答问题类型，1表示隐私信息，2表示自定义问题
   * @returns {Promise<Array>} - 返回问题模板列表
   */
  async getTmpQuestions(type: 1 | 2) {
    const res = await this.dauth.getTmpQuestions({ type });
    return res.data.data;
  }

  /**
   * 备份问答问题
   * @param {Object} options - 选项对象
   * @param {Array} options.list - 问答问题列表
   * @param {number} options.type - 问答问题类型，1表示隐私信息，2表示自定义问题
   * @returns {Promise<void>} - 无返回值
   */
  async backupByQuestion({ list, type }: any) {
    await this.saveQuestionToServer(list, type);
  }
  /**
   * 备份自定义问题
   * @param {Array} list - 问答问题列表
   * @returns {Promise<void>} - 无返回值
   */
  async backupByCustom(list: any[]) {
    // 将自定义问题保存到服务器
    await this.saveQuestionToServer(list, 2);
  }
  /**
   * 备份隐私信息
   * @param {Array} list - 问答问题列表
   * @returns {Promise<void>} - 无返回值
   */
  async backupByPrivacyInfo(list: any[]) {
    await this.saveQuestionToServer(list, 1);
  }

  /**
   * 将问答问题保存到服务器
   * @param {Array} list - 问答问题列表
   * @param {number} type - 问答问题类型，1为默认类型，2为自定义类型
   * @returns {Promise<void>} - 无返回值
   */
  async saveQuestionToServer(list: any[], type = 1) {
    let serverList = [];
    if (type == 1) {
      serverList = list.map((val) => ({
        Content: val.list.map((s: any) => ({
          Content: s.q,
          Characters: s.l,
          Answer: s.a,
        })),
        Title: val.title,
        Type: type,
      }));
    } else {
      let _list = list;
      _list = _list.map((v, i) => {
        return {
          id: i,
          list: v.list.filter((s: any) => s.a),
          title: v.title,
        };
      });
      _list = _list.filter((v) => v.list.length);

      serverList = _list.map((val) => ({
        Content: val.list.map((s: any) => ({
          Content: s.q,
          Characters: s.l,
          Answer: s.a,
        })),
        Title: val.title,
        Type: type,
      }));
    }
    await this.dauth.saveQuestions({
      questions: serverList,
    });
  }

  /**
   * 更新用户昵称
   * @param {Object} options - 选项对象
   * @param {string} options.name - 新昵称
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async updateName({ name }: { name: string }) {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.updateName({
      publicKey,
      name,
    });
    if (res.data.code === '000000') {
      this.accountInfo.name = name;
      return STATUS_CODE.SUCCESS;
    }
    return res;
  }
  /**
   * 更新用户头像
   * @param {Object} options - 选项对象
   * @param {File} options.file - 头像文件
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async updateAvatar({ file }: { file: File }) {
    const res = await this.dauth.uploadAvatar({
      file,
    });
    console.log(res);
    return res;
  }

  /**
   * 修改密码
   * @param {Object} options - 选项对象
   * @param {string} options.oldPwd - 旧密码
   * @param {string} options.newPwd - 新密码
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async changePassword({ oldPwd, newPwd }: any) {
    const result = await this.dauth.updatePassword({
      oldPassword: oldPwd,
      newPassword: newPwd,
    });
    return result.data.data;
  }
  /**
   * 获取密码
   * @param {string} account - 账户名
   * @param {string} verifyCode - 验证码
   * @returns {Promise<any>} - 返回获取到的密码
   */
  async getPassword({ account, verifyCode }: any) {
    return this.dauth.getPassword({ account, verifyCode });
  }
  /**
   * 保存问答问题到服务器
   * @param {Array} questions - 要保存的问答问题
   * @returns {Promise<any>} - 返回保存结果
   */
  async saveQuestions({ questions }: any) {
    const { publicKey } = this.accountInfo;
    return this.dauth.saveQuestions({ publicKey, questions });
  }
  /**
   * 获取问答问题
   * @returns {Promise<any>} - 返回问答问题
   */
  async getQuestions() {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.getQuestions({ publicKey });
    return res.data.data;
  }
  /**
   * 保存记事本内容到IPFS
   * @param {string} note - 要保存的记事本内容
   * @returns {Promise<void>} - 无返回值
   */
  async saveNote(content: string) {
    if (content) {
      const res = await this.dauth.uploadIpfsContent({
        content,
      });
      const { code, data } = res.data;
      if (code === '000000') {
        this.accountInfo.note_ipfs = data;
      }
    }
  }
  /**
   * 获取记事本内容
   * @returns {Promise<string>} - 返回记事本内容
   */
  async getNote() {
    const { note_ipfs } = this.accountInfo;
    const { VITE_IPFS_HOST } = import.meta.env;
    if (note_ipfs) {
      const res = await axios.get(`${VITE_IPFS_HOST}/${note_ipfs}`);
      const { data } = res;
      return data;
    } else {
      return '';
    }
  }
  /**
   * 订阅消息
   * @param {string} destPubkey - 目标公钥
   * @returns {Promise<any>} - 返回发布的消息数据
   */
  async publishMsg(destPubkey: string) {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.publishMsg({
      publicKey,
      destPubkey,
    });
    return res.data.data;
  }
  /**
   * 获取联系人列表
   * @returns {Promise<any>} - 返回联系人列表数据
   */
  async getContacts() {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.getContacts({
      publicKey,
    });
    return res.data.data;
  }
  /**
   * 接收消息
   * @param {string} destPubkey - 目标公钥
   * @returns {Promise<any>} - 返回接收到的消息数据
   */
  async receiveMsgs(destPubkey: string) {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.receiveMsgs({
      destPubkey,
    });
    return res.data.data;
  }
  /**
   * 获取所有消息
   * @param {string} destPubkey - 目标公钥
   * @returns {Promise<any>} - 返回所有消息数据
   */
  async getAllMsgs(destPubkey: string) {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.getAllMsgs({
      publicKey,
      destPubkey,
    });
    return res.data.data;
  }
  /**
   * 发送消息
   * @param {string} destPubkey - 目标公钥
   * @param {string} content - 消息内容
   * @returns {Promise<any>} - 返回发送消息数据
   */
  async sendMsg(destPubkey: string, content: string) {
    const res = await this.dauth.sendMsg({
      destPubkey,
      content,
    });
    return res.data.data;
  }
  /**
   * 开始消息服务
   * @returns {Promise<any>} - 返回消息服务数据
   */
  async startMsgService() {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.startMsgService({
      publicKey,
    });
    return res.data.data;
  }
}

export default new Account();
