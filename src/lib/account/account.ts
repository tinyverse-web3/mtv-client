import { MtvCrypto } from './crypto';
import { Keystore, Password } from './wallet';
import { KeyManager, KYEMANAGER_STATUS_CODE } from './keyManager';
import { KeySha } from './kvSha';
import { Dauth } from './dauth';
import CryptoJS from 'crypto-js';
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
  maintainPhrase: boolean;
  maintainProtector: boolean;
  maintainQuestion: boolean;
  privacyInfo: any;
  fingerprintPrivateData: string;
  textPrivateData: string;
  passwordPrivateData: string;
  customFeatureData: string;
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
  private readonly keystore = new Keystore();
  private readonly password = new Password();
  private readonly dauth = new Dauth();
  private crypto?: MtvCrypto;
  private keyManager?: KeyManager;
  public keySha?: KeySha;
  public privateKey?: string;
  private getAccountStatus: boolean = false;
  public accountInfo: AccountInfo = {
    publicKey: '',
    avatar: '',
    name: '',
    address: '',
    safeLevel: 0,
    fingerprintPrivateData: '',
    textPrivateData: '',
    passwordPrivateData: '',
    customFeatureData: '',
    featureData: undefined,
    bindStatus: false,
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
    }
  };
  constructor() {
    this.keyManager = new KeyManager();
  }
  /**
   * 初始化模块
   * @returns {any}
   */
  async initModule() {
    console.log('存储相关模块初始化');
    console.log(this.privateKey, this.accountInfo.publicKey);
    if (this.privateKey && !this.crypto) {
      this.crypto = new MtvCrypto(this.privateKey);
      await this.dauth.init(this.crypto);
      // this.mtvStorage = new MtvStorage(this.privateKey, this.crypto);
      // await this.mtvStorage.init();
      // console.log(this.mtvStorage);
      console.log('Dauth 存储加密模块初始化');
    }
    if (!this.keySha && this.accountInfo.publicKey) {
      this.keySha = new KeySha(this.accountInfo.publicKey, 'mtv');
      console.log('keySha 存储加密模块初始化');
    }
  }
  /**
   * 创建账户
   * @param password - 账户密码
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async create(password: string): Promise<STATUS_CODE> {
    const encryptPwd = await this.password.encrypt(password);
    await this.keyManager?.create(encryptPwd);

    let status = STATUS_CODE.SUCCESS;
    await this.getKeyInfo();
    try {
      await this.initModule();
      await this.getAccountInfo();
    } catch (error) {
      status = STATUS_CODE.MODULE_INIT_ERROR;
    }
    return status;
  }
  /**
   * 获取密钥信息
   * @returns {Promise<void>}
   */
  async getKeyInfo() {
    const {
      privateKey = '',
      publicKey = '',
      address = '',
    } = this.keyManager || {};
    this.accountInfo.publicKey = publicKey;
    this.accountInfo.address = address;
    this.accountInfo.pointAccount.address = address;
    this.privateKey = privateKey;
  }

  /**
   * 获取账户信息
   * @returns {Promise<void>}
   */
  async getAccountInfo() {
    if (this.getAccountStatus) {
      return;
    }
    const data = await this.dauth.get({
      key: `${LOCAL_ACCOUNT_KEY}_${this.accountInfo.publicKey}`,
    });
    this.getAccountStatus = true;
    console.log('getAccountInfo');
    console.log(data);
    if (data) {
      this.accountInfo = {
        ...this.accountInfo,
        ...data,
      };
    }
    console.log(this.accountInfo);
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
    await this.saveAccount();
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
    await this.saveAccount();
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
      type: 'text',
      content: arr.join('_'),
    });
    const { code, data } = res.data;
    if (code === '000000') {
      this.accountInfo.featureData = data;
      this.accountInfo.textPrivateData = textPrivateData;
      this.accountInfo.passwordPrivateData = passwordPrivateData;
      this.accountInfo.customFeatureData = customFeatureData;
      await this.saveAccount();
    }
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
      type: 'text',
      content: arr.join('_'),
    });
    const { code, data } = res.data;
    if (code === '000000') {
      this.accountInfo.featureData = data;
      this.accountInfo.textPrivateData = textPrivateData;
      this.accountInfo.passwordPrivateData = passwordPrivateData;
      this.accountInfo.customFeatureData = customFeatureData;
    }
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
  getMnemonic() {
    return this.keyManager?.getMnemonic();
  }
  resetAccountInfo() {
    this.accountInfo = {
      publicKey: '',
      avatar: '',
      name: '',
      address: '',
      safeLevel: 0,
      fingerprintPrivateData: '',
      textPrivateData: '',
      passwordPrivateData: '',
      customFeatureData: '',
      featureData: undefined,
      bindStatus: false,
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
      }
    };
  }
  /**
   * 检查账户状态
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async checkStatus() {
    const keyStatus = await this.keyManager?.check();
    let status;
    switch (keyStatus) {
      case KYEMANAGER_STATUS_CODE.EMPTY_KEYSTORE:
        status = STATUS_CODE.EMPTY_KEYSTORE;
        break;
      case KYEMANAGER_STATUS_CODE.EMPTY_PASSWORD:
        status = STATUS_CODE.INVALID_PASSWORD;
        break;
      case KYEMANAGER_STATUS_CODE.INVALID_PASSWORD:
        status = STATUS_CODE.INVALID_PASSWORD;
        break;
      case KYEMANAGER_STATUS_CODE.SUCCESS:
        status = STATUS_CODE.SUCCESS;
        try {
          await this.getKeyInfo();
          await this.initModule();
          await this.getAccountInfo();
        } catch (error) {
          console.log(error);
          status = STATUS_CODE.MODULE_INIT_ERROR;
        }
        break;
    }
    return status;
  }
  /**
   * 解锁账户
   * @param password - 账户密码
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async unlock(password: string) {
    const encryptPwd = await this.password.encrypt(password);
    const keyStatus = await this.keyManager?.verify(encryptPwd);
    if (keyStatus === KYEMANAGER_STATUS_CODE.INVALID_PASSWORD) {
      return STATUS_CODE.INVALID_PASSWORD;
    } else {
      try {
        await this.getKeyInfo();
        await this.initModule();
        await this.getAccountInfo();
        return STATUS_CODE.SUCCESS;
      } catch (error) {
        return STATUS_CODE.MODULE_INIT_ERROR;
      }
    }
  }
  /**
   * 删除账户信息，包括密码和密钥管理器
   * @returns {Promise<void>}
   */
  async remove() {
    await Promise.all([this.password.remove(), this.keyManager?.delete()]);
    this.resetAccountInfo();
    this.crypto = undefined;
    this.keySha = undefined;
  }
  /**
   * 锁定账户，删除密码和重置账户信息
   * @returns {Promise<void>}
   */
  async lock() {
    await this.password.remove();
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
  }) {
    const encryptPwd = await this.password.encrypt(password);
    let status;
    if (!phrase && !entropy && !shares?.length) {
      return STATUS_CODE.EMPTY_INPUT;
    }
    try {
      if (phrase) {
        await this.keyManager?.restoreFromPhrase(phrase, encryptPwd);
      } else if (entropy) {
        await this.keyManager?.restoreFromEntropy(entropy, encryptPwd);
      } else if (shares?.length) {
        await this.keyManager?.restoreFromShares(shares, encryptPwd);
      }
      status = STATUS_CODE.SUCCESS;
    } catch (error) {
      console.error(error);
      status = STATUS_CODE.RESTORE_ERROR;
      return status;
    }
    await this.getKeyInfo();
    try {
      await this.initModule();
      await this.getAccountInfo();
    } catch (error) {
      status = STATUS_CODE.MODULE_INIT_ERROR;
    }
    return status;
  }
  /**
   * 获取 SSS 数据
   * @param {Object} options - 选项对象
   * @param {string} options.account - 账户名
   * @param {string} options.verifyCode - 验证码
   * @param {string} options.type - 类型
   * @returns {Promise<Object>} - 返回包含 SSS 数据和状态码的对象
   */
  async getSssData({
    account,
    verifyCode,
    type,
  }: {
    account: string;
    verifyCode: string;
    type: string;
  }) {
    return await this.dauth.getSssData({
      account,
      verifyCode,
      type,
      privateData: this.accountInfo.featureData,
    });
  }
  /**
   * 通过守护者恢复账户信息
   * @param {Object} options - 选项对象
   * @param {string} options.account - 守护者账户名
   * @param {string} options.verifyCode - 验证码
   * @param {string} options.password - 账户密码
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async restoreByGuardian({ account, verifyCode, password }: any) {
    const res = await this.getSssData({
      account,
      verifyCode,
      type: 'guardian',
    });
    const { data, code } = res.data;
    if (code === '000000') {
      const { sssData, guardians } = data;
      const { account: hashAccount, publicKey } = guardians[0];
      console.log(hashAccount, publicKey);
      this.accountInfo.publicKey = publicKey;
      await this.initModule();
      const shareB = await this.keySha?.get(hashAccount);
      console.log('shareB', shareB);
      const shares: string[] = [sssData, shareB];
      console.log(shares);
      const status = await this.restore({ password, shares });
      return status;
    }
    return STATUS_CODE.RESTORE_ERROR;
  }
  /**
   * 通过密保问题恢复账户信息
   * @param {Object} options - 选项对象
   * @param {Array} options.questions - 密保问题列表
   * @param {string} options.publicKey - 公钥
   * @param {string} options.sssData - SSS 数据
   * @param {string} options.password - 账户密码
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async restoreByQuestions({ questions, publicKey, sssData, password }: any) {
    this.accountInfo.publicKey = publicKey;
    await this.initModule();
    const kvShares: any[] = [];
    for (let i = 0; i < questions.length; i++) {
      const s = questions[i];
      try {
        const q = s.list.map((val: any) => val.q).join('');
        const a = s.list.map((val: any) => val.a).join('');
        const v = await this.dauth.getSssDataForUser({
          publicKey,
          type: 'question',
          question: q,
          answer: a,
          privateData: this.accountInfo.featureData,
        });
        if (v.data.code === '000000') {
          kvShares.push(v.data.data);
        }
      } catch (error) {
        return STATUS_CODE.RESTORE_ERROR;
      }
    }
    const shares = [sssData, ...kvShares].filter(Boolean);
    const status = await this.restore({ password, shares });
    return status;
  }
  /**
   * 保存账户信息到本地
   */
  async saveAccount() {
    await this.dauth.put({
      key: `${LOCAL_ACCOUNT_KEY}_${this.accountInfo.publicKey}`,
      value: this.accountInfo,
      duration: 60 * 60 * 24 * 365,
    });
  }
  async sync() {}

  /**
   * 计算用户安全等级
   */
  calcUserLevel() {
    const { maintainPhrase, maintainProtector, maintainQuestion } =
      this.accountInfo;
    let level = 0;
    if (maintainPhrase) {
      level = 1;
    }
    if (maintainProtector) {
      level = 2;
    }
    if (maintainQuestion || (maintainPhrase && maintainProtector)) {
      level = 3;
    }
    this.accountInfo.safeLevel = level;
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
      publicKey,
      account,
      verifyCode,
      privateData: this.accountInfo.featureData,
    });
    if (res.data.code === '000000') {
      const hashAccount = CryptoJS.MD5(account).toString();

      if (!this.accountInfo.guardians.find((v) => v.hash === hashAccount)) {
        this.accountInfo.guardians.push({
          name: account,
          hash: hashAccount,
          type,
        });
      }
      const len = this.accountInfo.guardians.length;
      this.accountInfo.bindStatus = true;
      await this.saveAccount();
      return STATUS_CODE.SUCCESS;
    } else {
      return STATUS_CODE.ERROR;
    }
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
        this.saveAccount();
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
    this.calcUserLevel();
    await this.saveAccount();
  }

  /**
   * 备份守护者
   * @returns {Promise<void>} - 无返回值
   */
  async backupByGuardian() {
    const shares = await this.keyManager?.sssSplit(2, 2);
    if (shares?.length) {
      // 将 SSS 数据分别存储到每个守护者的 Key-Value 存储中
      const kvMap = this.accountInfo.guardians.map((s, i) => {
        return this.keySha?.put({
          key: s.hash,
          value: shares[1],
        });
      });
      const { publicKey } = this.accountInfo;
      // 将 SSS 数据存储到服务器
      await Promise.all([
        ...kvMap,
        this.dauth.saveSssData({
          publicKey,
          appName: 'mtv',
          privateData: this.accountInfo.featureData,
          sssData: shares[0],
          type: 'guardian',
        }),
      ]);
      this.accountInfo.maintainProtector = true;
      this.calcUserLevel();
      await this.saveAccount();
    }
  }

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
    let filterAnswer: any[] = [];
    if (type === 1) {
      // 过滤掉没有回答的问题
      const _list = list.map((v: any, i: number) => {
        return {
          id: i,
          list: v.list.filter((s: any) => s.a),
          title: v.title,
        };
      });
      filterAnswer = _list.filter((v: any) => v.list.length);
    } else {
      // 过滤掉没有回答的问题
      filterAnswer = list.filter((v: any) =>
        v.list.every(
          (v: any) => v.a !== undefined && v.a !== null && v.a !== '',
        ),
      );
    }
    try {
      const { publicKey } = this.accountInfo;
      // 使用Shamir's Secret Sharing算法将密钥分割成多份
      const shares = await this.keyManager?.sssSplit(
        filterAnswer.length + 1,
        2,
      );
      if (shares) {
        const serverShare = shares?.[0];
        const kvShares = shares.slice(1);
        const kvMap = kvShares?.map((s, i) => {
          const q = filterAnswer[i].list.map((val: any) => val.q).join('');
          const a = filterAnswer[i].list.map((val: any) => val.a).join('');
          // 将密钥分割后的数据保存到服务器
          return this.dauth.saveSssDataForUser({
            publicKey,
            type: 'question',
            question: q,
            answer: a,
            privateData: this.accountInfo.featureData,
            sssData: s,
          });
        });
        // 将密钥分割后的数据保存到服务器
        await Promise.all([
          ...kvMap,
          this.dauth.saveSssData({
            publicKey,
            appName: 'mtv',
            privateData: this.accountInfo.featureData,
            sssData: serverShare,
            type: 'question',
          }),
        ]);
        // 更新账户信息
        this.accountInfo.maintainQuestion = true;
        this.calcUserLevel();
        await this.saveAccount();
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 备份自定义问题
   * @param {Array} list - 问答问题列表
   * @returns {Promise<void>} - 无返回值
   */
  async backupByCustom(list: any[]) {
    // 备份自定义问题
    await this.backupByQuestion({ list, type: 2 });
    // 将自定义问题保存到服务器
    await this.saveQuestionToServer(list, 2);
  }
  /**
   * 备份隐私信息
   * @param {Array} list - 问答问题列表
   * @returns {Promise<void>} - 无返回值
   */
  async backupByPrivacyInfo(list: any[]) {
    // 将问答问题保存到服务器
    await this.saveQuestionToServer(list, 1);
    // 构建隐私信息对象
    const privacyInfo: any = {};
    list.forEach((v) => {
      v.list.forEach((s: any) => {
        privacyInfo[s.q] = s.a;
      });
    });
    // 更新账户信息中的隐私信息
    this.accountInfo.privacyInfo = privacyInfo;
    // 备份问答问题
    await this.backupByQuestion({ list, type: 1 });
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
        content: JSON.stringify(
          val.list.map((s: any) => ({ content: s.q, characters: s.l })),
        ),
        title: val.title,
        type,
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
        content: JSON.stringify(
          val.list.map((s: any) => ({ content: s.q, characters: s.l })),
        ),
        title: val.title,
        type,
      }));
    }
    const { publicKey } = this.accountInfo;
    await this.dauth.saveQuestions({
      publicKey,
      privateData: this.accountInfo.featureData,
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
      this.saveAccount();
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
    const res = await this.dauth.uploadIpfsFile({
      file,
    });
    if (res.data.code === '000000') {
      this.accountInfo.avatar = res.data.data;
      this.saveAccount();
      return STATUS_CODE.SUCCESS;
    }
    return res;
  }

  /**
   * 修改密码
   * @param {Object} options - 选项对象
   * @param {string} options.oldPwd - 旧密码
   * @param {string} options.oldHashPwd - 旧密码的哈希值
   * @param {string} options.newPwd - 新密码
   * @param {boolean} options.saveStatus - 是否保存密码
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async changePassword({
    oldPwd,
    oldHashPwd,
    newPwd,
    saveStatus = false,
  }: any) {
    let _oldHashPwd;
    const newHashPwd = await this.password.encrypt(newPwd);
    if (oldHashPwd) {
      _oldHashPwd = oldHashPwd;
    } else if (oldPwd) {
      _oldHashPwd = await this.password.encrypt(oldPwd);
    }
    const keyStatus = await this.keyManager?.changeHashPwd(
      _oldHashPwd,
      newHashPwd,
    );
    let status = STATUS_CODE.SUCCESS;
    if (keyStatus === KYEMANAGER_STATUS_CODE.SUCCESS && saveStatus) {
      const { publicKey } = this.accountInfo;
      try {
        await this.dauth.savePassword({
          publicKey,
          password: newHashPwd,
        });
      } catch (error) {
        console.error(error);
        status = STATUS_CODE.SAVE_PASSWOR_ERROR;
      }
    } else if (keyStatus !== KYEMANAGER_STATUS_CODE.SUCCESS) {
      status = STATUS_CODE.INVALID_PASSWORD;
    }
    return status;
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
  async saveNote(note: string) {
    const content = await this.crypto?.encrypt(note);
    if (content) {
      const res = await this.dauth.uploadIpfsContent({
        content,
      });
      const { code, data } = res.data;
      if (code === '000000') {
        this.accountInfo.note_ipfs = data;
        await this.saveAccount();
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
      if (data) {
        const content = await this.crypto?.decrypt(data);
        return content;
      }
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
    const { privateKey } = this;
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.startMsgService({
      privateKeyHash: privateKey,
      publicKey,
    });
    return res.data.data;
  }
}

export default new Account();
