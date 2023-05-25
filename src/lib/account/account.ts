import { MtvCrypto } from './crypto';
import { MtvStorage } from './storage';
import { Keystore, Password } from './wallet';
import { Shamir } from '@/lib/account';
import { KeyManager, KYEMANAGER_STATUS_CODE } from './keyManager';
import { ethers } from 'ethers';
import { KeySha } from './kvSha';
import { Dauth } from './dauth';
import EthCrypto from 'eth-crypto';
import CryptoJS from 'crypto-js';

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
  nostr: NostrInfo;
  guardians: Guardian[];
}

/* SafeLevel 用户等级
0级：临时账户，账户无法恢复，数据随时会丢失，请尽快做账户维护。
1级：账户存在单点故障，请尽快做账户维护。
2级：账户依赖其他账户的安全，请尽快做账户维护。
3级：低标准账户，建议提升安全级别。
4级：标准账户，您的账户已经很安全，但还有提升空间。
5级：高标准账户，您的账户已经得到完全的保护。
*/

export class Account {
  private readonly keystore = new Keystore();
  private readonly password = new Password();
  private readonly dauth = new Dauth();
  private crypto?: MtvCrypto;
  // private mtvStorage?: MtvStorage;
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
    bindStatus: false,
    maintainPhrase: false,
    maintainProtector: false,
    maintainQuestion: false,
    privacyInfo: {},
    nostr: {
      pk: '',
      sk: '',
    },
    guardians: [],
  };
  constructor() {
    this.keyManager = new KeyManager();
  }
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
  async create(password: string) {
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
  async getKeyInfo() {
    const {
      privateKey = '',
      publicKey = '',
      address = '',
    } = this.keyManager || {};
    this.accountInfo.publicKey = publicKey;
    this.accountInfo.address = address;
    this.privateKey = privateKey;
  }
  async getAccountInfo() {
    if (this.getAccountStatus) {
      return;
    }
    const data = await this.dauth.get({ key: LOCAL_ACCOUNT_KEY });
    this.getAccountStatus = true;
    console.log('getAccountInfo');
    console.log(data);
    if (data) {
      this.accountInfo = {
        ...this.accountInfo,
        ...data,
      };
    }
  }
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
      bindStatus: false,
      maintainPhrase: false,
      maintainProtector: false,
      maintainQuestion: false,
      privacyInfo: {},
      nostr: {
        pk: '',
        sk: '',
      },
      guardians: [],
    };
  }
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
  async remove() {
    await Promise.all([this.password.remove(), this.keyManager?.delete()]);
    this.resetAccountInfo();
    // this.mtvStorage = undefined;
    // this.crypto = undefined;
    // this.keySha = undefined;
  }
  async lock() {
    await this.password.remove();
    this.resetAccountInfo();
    // this.mtvStorage = undefined;
    // this.crypto = undefined;
    // this.keySha = undefined;
  }
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
  async getSssData({ account, verifyCode, type, privateData }: any) {
    return await this.dauth.getSssData({
      account,
      verifyCode,
      type,
      privateData,
    });
  }
  async restoreByGuardian({ account, verifyCode, password }: any) {
    const res = await this.getSssData({
      account,
      verifyCode,
      type: 'guardian',
      privateData: '123',
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
  async restoreByQuestions({ questions, publicKey, sssData, password }: any) {
    this.accountInfo.publicKey = publicKey;
    await this.initModule();
    const kvShares: any[] = [];
    // const errArr: string[] = [];
    for (let i = 0; i < questions.length; i++) {
      const s = questions[i];
      try {
        console.log(s);
        const q = s.list.map((val: any) => val.q).join('');
        const a = s.list.map((val: any) => val.a).join('');
        const v = await this.keySha?.get(q + a);
        kvShares.push(v);
        // errArr.push('');
      } catch (error) {
        return STATUS_CODE.RESTORE_ERROR;
        // errArr.push(`问题${chineseNumMap[i]}答案错误`);
      }
    }
    const shares = [sssData, ...kvShares].filter(Boolean);
    const status = await this.restore({ password, shares });
    return status;
  }
  async saveAccount() {
    await this.dauth.put({
      privateData: '123',
      key: LOCAL_ACCOUNT_KEY,
      value: this.accountInfo,
      duration: 60 * 60 * 24 * 365,
    });
  }
  async sync() {}
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
  async sendVerifyCode({ type, account }: any) {
    return await this.dauth.sendVerifyCode({ account, type });
  }
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
  async backupByPharse() {
    this.accountInfo.maintainPhrase = true;
    this.calcUserLevel();
    await this.saveAccount();
  }
  async backupByGuardian() {
    const shares = await this.keyManager?.sssSplit(2, 2);
    if (shares?.length) {
      const kvMap = this.accountInfo.guardians.map((s, i) => {
        return this.keySha?.put({
          privateData: '123',
          key: s.hash,
          value: shares[1],
        });
      });
      const { publicKey } = this.accountInfo;
      await Promise.all([
        ...kvMap,
        this.dauth.saveSssData({
          publicKey,
          appName: 'mtv',
          privateData: '123',
          sssData: shares[0],
          type: 'guardian',
        }),
      ]);
      this.accountInfo.maintainProtector = true;
      this.calcUserLevel();
      await this.saveAccount();
    }
  }
  async getTmpQuestions(type: 1 | 2) {
    const res = await this.dauth.getTmpQuestions({ type });
    return res.data.data;
  }
  async backupByQuestion({ list, type }: any) {
    // let _list = list.map((v: any) => {
    //   return {
    //     list: v.list.filter((s: any) => s.a),
    //     title: v.title,
    //   };
    // });
    let filterAnswer: any[] = [];
    if (type === 1) {
      const _list = list.map((v: any, i: number) => {
        return {
          id: i,
          list: v.list.filter((s: any) => s.a),
          title: v.title,
        };
      });
      filterAnswer = _list.filter((v: any) => v.list.length);
    } else {
      filterAnswer = list.filter((v: any) =>
        v.list.every(
          (v: any) => v.a !== undefined && v.a !== null && v.a !== '',
        ),
      );
    }
    try {
      const { publicKey } = this.accountInfo;
      const shares = await this.keyManager?.sssSplit(filterAnswer.length + 1, 2);
      if (shares) {
        const serverShare = shares?.[0];
        const kvShares = shares.slice(1);
        const kvMap = kvShares?.map((s, i) => {
          const q = filterAnswer[i].list.map((val: any) => val.q).join('');
          const a = filterAnswer[i].list.map((val: any) => val.a).join('');
          return this.keySha?.put({
            privateData: '123',
            key: q + a,
            value: s,
          });
        });
        await Promise.all([
          ...kvMap,
          this.dauth.saveSssData({
            publicKey,
            appName: 'mtv',
            privateData: '123',
            sssData: serverShare,
            type: 'question',
          }),
        ]);
        this.accountInfo.maintainQuestion = true;
        this.calcUserLevel();
        await this.saveAccount();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async backupByCustom(list: any[]) {
    await this.backupByQuestion({ list, type: 2 });
    await this.saveQuestionToServer(list, 2);
  }
  async backupByPrivacyInfo(list: any[]) {
    await this.saveQuestionToServer(list, 1);
    const privacyInfo: any = {};
    list.forEach((v) => {
      v.list.forEach((s: any) => {
        privacyInfo[s.q] = s.a;
      });
    });
    this.accountInfo.privacyInfo = privacyInfo;
    await this.backupByQuestion({ list, type: 1 });
  }
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
      questions: serverList,
    });
  }
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
    });
    if (res.data.code === '000000') {
      const index = this.accountInfo.guardians.findIndex(
        (v) => v.name === account,
      );
      if (index > -1) {
        this.accountInfo.guardians.splice(index, 1);
        this.saveAccount();
      }
      return STATUS_CODE.SUCCESS;
    }
    return res;
  }
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
  async getPassword({ account, verifyCode }: any) {
    return this.dauth.getPassword({ account, verifyCode });
  }
  async saveQuestions({ questions }: any) {
    const { publicKey } = this.accountInfo;
    return this.dauth.saveQuestions({ publicKey, questions });
  }
  async getQuestions() {
    const { publicKey } = this.accountInfo;
    const res = await this.dauth.getQuestions({ publicKey });
    return res.data.data;
  }
  // async updateAvatar({ file }: { file: File }) {
  //   const { publicKey } = this.accountInfo;
  //   const res = await this.dauth.updateName({
  //     publicKey,
  //     name,
  //   });
  //   if (res.data.code === '000000') {
  //     this.accountInfo.name = name;
  //     this.saveAccount();
  //     return STATUS_CODE.SUCCESS;
  //   }
  //   return res;
  // }
}
