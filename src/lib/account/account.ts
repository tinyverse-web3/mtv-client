import { Dauth } from './dauth';
import i18n from '@/locales';
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
  private readonly dauth = new Dauth();
  private account = '';
  private passwordPrivateData = '';
  constructor() {}
  /**
   * 创建账户
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async create() {
    const res = await this.dauth.createMasterAccount();
    return res.data;
  }
  async hasPassword() {
    try {
      const result = await this.dauth.hasPassword();
      return result.data.data === true;
    } catch (error) {
      return false;
    }
  }
  async hasLocalAccount() {
    try {
      const result = await this.dauth.hasLocalAccount();
      return result.data.data === true;
    } catch (error) {
      return false;
    }
  }
  /**
   * 验证账户
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async verifyEmail({ account, verifyCode }: any) {
    this.account = account;
    const res = await this.dauth.verifyEmail({ account, verifyCode });
    return res.data;
  }
  async updatePasswordByGuardian({ account, verifyCode, password }: any) {
    this.account = account;
    const result = await this.dauth.updatePasswordByGuardian({
      account,
      verifyCode,
      password,
    });
    return result.data;
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
    const { code, data } = result.data;
    if (code === '000000') {
      return data;
    } else {
      return {};
    }
  }
  async getNotes() {
    const result = await this.dauth.getNotes();
    return result.data;
  }
  async delNote({ Id }: any) {
    const result = await this.dauth.delNote({ Id });
    return result.data;
  }
  async addNote({ Title, Content }: any) {
    const result = await this.dauth.addNote({ Title, Content });
    return result.data;
  }
  async modifyNote({ Id, Title, Content }: any) {
    const result = await this.dauth.modifyNote({ Id, Title, Content });
    return result.data;
  }
  async getCodebookList() {
    const result = await this.dauth.getCodebookList();
    return result.data;
  }
  async delCodebook({ Id }: any) {
    const result = await this.dauth.delCodebook({ Id });
    return result.data;
  }
  async addCodebook({ Title, Account, Password, Url }: any) {
    const result = await this.dauth.addCodebook({
      Title,
      Account,
      Password,
      Url,
    });
    return result.data;
  }
  async modifyCodebook({ Id, Title, Account, Password, Url }: any) {
    const result = await this.dauth.modifyCodebook({
      Id,
      Title,
      Account,
      Password,
      Url,
    });
    return result.data;
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
   * 设置私有数据
   * @param textPrivateData - 文本私有数据
   * @param passwordPrivateData - 密码私有数据
   * @param customFeatureData - 自定义特征数据
   * @returns {Promise<void>}
   */
  async setPivateData(
    textPrivateData: string,
    passwordPrivateData: string,
    CustomPrivateData: string,
  ) {
    const arr = [
      textPrivateData,
      passwordPrivateData,
      CustomPrivateData,
    ].filter(Boolean);
    const res = await this.dauth.generateFeatureData({
      textPrivateData,
      passwordPrivateData,
      CustomPrivateData,
    });
    return res?.data;
  }
  /**
   * 恢复私有数据
   * @param textPrivateData - 文本私有数据
   * @param passwordPrivateData - 密码私有数据
   * @param CustomPrivateData - 自定义特征数据
   * @returns {Promise<void>}
   */
  async restorePivateData(
    textPrivateData: string,
    passwordPrivateData: string,
    CustomPrivateData: string,
  ) {
    const arr = [
      textPrivateData,
      passwordPrivateData,
      CustomPrivateData,
    ].filter(Boolean);
    const res = await this.dauth.generateFeatureData({
      textPrivateData,
      passwordPrivateData,
      CustomPrivateData,
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
  async getMnemonic() {
    const result = await this.dauth.getMnemonic();
    return result.data.data;
  }
  async downloadMnemonic() {
    const result = await this.dauth.downloadMnemonic();
    return result.data;
  }
  async retrieveAccountByUploadMnemonic({
    file,
    TextPrivateData,
    PasswordPrivateData,
    CustomPrivateData,
  }: any) {
    const result = await this.dauth.retrieveAccountByUploadMnemonic({
      file,
      TextPrivateData,
      PasswordPrivateData,
      CustomPrivateData,
    });
    return result.data;
  }

  async getBalance() {
    const result = await this.dauth.getBalance();
    return result.data;
  }
  async applyDailyReward() {
    const result = await this.dauth.applyDailyReward();
    return result.data;
  }
  async applyGuardianReward() {
    const result = await this.dauth.applyGuardianReward();
    return result.data;
  }
  async applyVaultReward() {
    const result = await this.dauth.applyVaultReward();
    return result.data;
  }
  async applyInviterReward(InvitationCode: string) {
    const result = await this.dauth.applyInviterReward(InvitationCode);
    return result.data;
  }
  async getRewardList() {
    const result = await this.dauth.getRewardList();
    return result.data;
  }
  async invokeReward(RewardId: string) {
    const result = await this.dauth.invokeReward(RewardId);
    return result.data;
  }
  async getRewardStatusList() {
    const result = await this.dauth.getRewardStatusList();
    return result.data;
  }
  async getLatestVersion() {
    const result = await this.dauth.getLatestVersion();
    return result.data;
  }
  async checkVersion(CurVersion: string) {
    const result = await this.dauth.checkVersion(CurVersion);
    return result.data;
  }
  async getInvitationCode() {
    const result = await this.dauth.getInvitationCode();
    return result.data;
  }
  async saveMnemonic() {
    const result = await this.dauth.saveMnemonic();
    return result.data;
  }
  async retrieveAccountByMnemonic({
    mnemonic,
    textPrivateData,
    passwordPrivateData,
    CustomPrivateData,
  }: any) {
    const result = await this.dauth.retrieveAccountByMnemonic({
      mnemonic,
      textPrivateData,
      passwordPrivateData,
      CustomPrivateData,
    });
    return result.data;
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
    return result.data.code === '000000';
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
    // this.mtvStorage = undefined;
    // this.crypto = undefined;
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
    account,
    textPrivateData,
    passwordPrivateData,
    CustomPrivateData,
  }: {
    account?: string | null;
    textPrivateData?: string;
    passwordPrivateData?: string;
    CustomPrivateData?: string;
  }) {
    const res = await this.dauth.retrieveAccountByGuardian({
      account: account || this.account,
      textPrivateData,
      passwordPrivateData,
      CustomPrivateData,
    });
    return res.data;
  }
  async getQuestions4Retrieve({
    // account,
    textPrivateData,
    passwordPrivateData,
    CustomPrivateData,
  }: {
    // account: string;
    textPrivateData: string;
    passwordPrivateData: string;
    CustomPrivateData: string;
  }) {
    const result = await this.dauth.getQuestions4Retrieve({
      textPrivateData,
      passwordPrivateData,
      CustomPrivateData,
    });
    return result.data;
  }
  /**
   * 通过密保问题恢复账户信息
   * @param {Object} options - 选项对象
   * @param {Array} options.list - 密保问题列表
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async restoreByQuestions({
    list,
    type = 1,
    textPrivateData,
    passwordPrivateData,
    CustomPrivateData,
  }: {
    list: any[];
    type: number;
    textPrivateData: string;
    passwordPrivateData: string;
    CustomPrivateData: string;
  }) {
    let serverList = [];
    if (type == 1) {
      serverList = list.map((val: any) => ({
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
    const res = await this.dauth.retrieveAccountBySmartPrivacy({
      Questions: serverList,
      PasswordPrivateData: passwordPrivateData,
      TextPrivateData: textPrivateData,
      CustomPrivateData: CustomPrivateData,
    });
    return res.data;
  }
  /**
   * 发送验证码
   * @param {Object} options - 选项对象
   * @param {string} options.type - 验证码类型
   * @param {string} options.account - 账户名
   * @returns {Promise<Object>} - 返回包含状态码和数据的对象
   */
  async sendVerifyCode({ type, account }: any) {
    const res = await this.dauth.sendVerifyCode({ account, type });
    return res.data;
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
    const res = await this.dauth.addGuardian({
      account,
      verifyCode,
      type,
    });
    return res.data;
  }
  /**
   * 删除守护者
   * @param {Object} options - 选项对象
   * @param {string} options.account - 守护者账户名
   * @param {string} options.type - 守护者类型
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async delGuardian({ account }: { account: string }) {
    const res = await this.dauth.delGuardian({
      account,
    });
    return res.data;
  }
  /**
   * 通过助记词备份账户信息
   * @returns {Promise<void>} - 无返回值
   */
  async backupByPharse() {
    // this.accountInfo.maintainPhrase = true;
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
        Lang: i18n.language,
        Type: type,
      }));
    } else {
      let _list = list;
      _list = _list.map((v, i) => {
        return {
          id: i,
          // list: v.list.filter((s: any) => s.a),
          list: v.list,
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
        Lang: i18n.language,
        Title: val.title,
        Type: type,
      }));
    }
    await this.dauth.saveQuestions({
      Type: type,
      Questions: serverList,
    });
  }

  /**
   * 更新用户昵称
   * @param {Object} options - 选项对象
   * @param {string} options.name - 新昵称
   * @returns {Promise<STATUS_CODE>} - 返回状态码
   */
  async updateName({ name }: { name: string }) {
    const res = await this.dauth.updateName({
      name,
    });
    return res.data;
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
    return res.data;
  }
  async setAvatar(NftName: string) {
    const res = await this.dauth.setAvatar(NftName);
    return res.data;
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
    const res = await this.dauth.uploadFile({
      file,
      type,
      password,
    });
    return res.data;
  }
  async getFileList({ type }: any) {
    const res = await this.dauth.getFileList({ type });
    return res.data;
  }
  async delFile({ Filename, Type }: any) {
    const res = await this.dauth.delFile({ FileName: Filename, Type });
    return res.data;
  }
  async downloadFile({ Filename, Type, Password }: any) {
    const res = await this.dauth.downloadFile({
      FileName: Filename,
      Type,
      Password,
    });
    return res.data;
  }
  async uploadAlbum({ file }: { file: File }) {
    const res = await this.dauth.uploadAlbum({
      file,
    });
    return res.data;
  }
  async downloadAlbum(fileName: string) {
    const res = await this.dauth.downloadAlbum({
      FileName: fileName,
    });
    return res.data;
  }
  async delAlbum({ Filename }: any) {
    const res = await this.dauth.delAlbum({ FileName: Filename });
    return res.data;
  }
  async getAlbumList() {
    const res = await this.dauth.getAlbumList();
    return res.data;
  }
  async oauthGoogle(data: any) {
    const res = await this.dauth.oauthGoogle(data);
    return res.data;
  }
  async oauthTelegram({ Id, Params }: any) {
    const res = await this.dauth.oauthTelegram({ Id, Params });
    return res.data;
  }
  async verifyByTelegram({ Id, Params }: any) {
    const res = await this.dauth.verifyByTelegram({ Id, Params });
    return res.data;
  }
  async verifyByGoogle(data: any) {
    const res = await this.dauth.verifyByGoogle(data);
    return res.data;
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
    return result.data;
  }
  async checkPassword(password: string) {
    const res = await this.dauth.checkPassword({ password });
    return res.data;
  }
  /**
   * 获取问答问题
   * @returns {Promise<any>} - 返回问答问题
   */
  async getQuestions(Type: number) {
    const res = await this.dauth.getQuestions(Type);
    return res.data.data;
  }
  /**
   * 获取联系人列表
   * @returns {Promise<any>} - 返回联系人列表数据
   */
  async getContacts() {
    const res = await this.dauth.getContacts();
    return res.data;
  }
  async createContactByMasterKey(destPubkey: string) {
    const res = await this.dauth.createContactByMasterKey({ destPubkey });
    return res.data;
  }
  async createContactByWalletKey(destPubkey: string) {
    const res = await this.dauth.createContactByWalletKey({ destPubkey });
    return res.data;
  }
  async delContact(destPubkey: string) {
    const res = await this.dauth.delContact({ destPubkey });
    return res.data;
  }
  async clearContactMessage(DestPubkey: string) {
    const res = await this.dauth.clearContactMessage({ DestPubkey });
    return res.data;
  }
  async setContactAlias({ destPubkey, alias }: any) {
    const res = await this.dauth.setContactAlias({
      destPubkey,
      alias,
    });
    return res.data;
  }
  /**
   * 接收消息
   * @param {string} destPubkey - 目标公钥
   * @returns {Promise<any>} - 返回接收到的消息数据
   */
  async receiveMsgs(destPubkey: string) {
    const res = await this.dauth.receiveMsgs({
      destPubkey,
    });
    return res.data.data;
  }
  async getMsgAvatar(destPubkey: string) {
    const res = await this.dauth.getMsgAvatar({
      destPubkey,
    });
    return res.data.data;
  }
  async getMsgProfile(destPubkey: string) {
    const res = await this.dauth.getMsgProfile({
      destPubkey,
    });
    return res.data;
  }
  /**
   * 获取所有消息
   * @param {string} destPubkey - 目标公钥
   * @returns {Promise<any>} - 返回所有消息数据
   */
  async getAllMsgs(destPubkey: string) {
    const res = await this.dauth.getAllMsgs({
      destPubkey,
    });
    return res.data.data;
  }
  async getMoreMsgs(DestPubkey: string, Content: string) {
    const res = await this.dauth.getMoreMsgs({
      DestPubkey,
      Content,
    });
    return res.data;
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
    return res.data;
  }
  async applyNewGun({
    GunName,
    ValidTime,
  }: {
    GunName: string;
    ValidTime: any;
  }) {
    const res = await this.dauth.applyNewGun({ GunName, ValidTime });
    return res.data;
  }

  async renewGun({ GunName, ValidTime }: { GunName: string; ValidTime: any }) {
    const res = await this.dauth.renewGun({ GunName, ValidTime });
    return res.data;
  }

  async getGun({ GunName }: { GunName: string }) {
    const res = await this.dauth.getGun({ GunName });
    return res.data;
  }

  async getGunList() {
    const res = await this.dauth.getGunList();
    return res.data;
  }
  async transferPoint({ WalletAddr, Amount, Gas, Comment }: any) {
    const res = await this.dauth.transferPoint({
      WalletAddr,
      Amount,
      Gas,
      Comment,
    });
    return res.data;
  }

  async mintNftFile({ file, Name, Description }: any) {
    const res = await this.dauth.mintNftFile({ file, Name, Description });
    return res.data;
  }

  async transferNft({ WalletAddr, NftName, Amount }: any) {
    const res = await this.dauth.transferNft({ WalletAddr, NftName, Amount });
    return res.data;
  }
  async mintNftText({ Name, Content, Description }: any) {
    const res = await this.dauth.mintNftText({ Name, Content, Description });
    return res.data;
  }
  async getNftList() {
    const { data } = await this.dauth.getNftList();
    return data;
  }
  async getNftDetail(NftName: string) {
    const { data } = await this.dauth.getNftDetail({ NftName });
    return data;
  }
  async downloadNftFile({ NftName }: any) {
    const { data } = await this.dauth.downloadNftFile({ NftName });
    return data;
  }
  async getTXDetails() {
    const { data } = await this.dauth.getTXDetails();
    return data;
  }
  async getTXMore(Addr: string) {
    const { data } = await this.dauth.getTXMore(Addr);
    return data;
  }
  async getDataSummary() {
    const { data } = await this.dauth.getDataSummary();
    return data;
  }
  async getDataStatus() {
    const { data } = await this.dauth.getDataStatus();
    return data;
  }
  async getDataList(DataType: string) {
    const { data } = await this.dauth.getDataList({ DataType });
    return data;
  }
  async getDataDetail({ DataType, Key, Cid }: any) {
    const { data } = await this.dauth.getDataDetail({ DataType, Key, Cid });
    return data;
  }
  async addAuthenticator({ Account, Secret }: any) {
    const { data } = await this.dauth.addAuthenticator({ Account, Secret });
    return data;
  }
  async generateGoogleSecret() {
    const { data } = await this.dauth.generateGoogleSecret();
    return data;
  }
  async getAuthenticatorCodes() {
    const { data } = await this.dauth.getAuthenticatorCodes();
    return data;
  }
  async getAuthenticatorAccounts() {
    const { data } = await this.dauth.getAuthenticatorAccounts();
    return data;
  }
  async getAuthenticatorCode({ AccountName }: any) {
    const { data } = await this.dauth.getAuthenticatorCode({ AccountName });
    return data;
  }
  async getAuthenticatorSecret({ AccountName }: any) {
    const { data } = await this.dauth.getAuthenticatorSecret({ AccountName });
    return data;
  }
  async delAuthenticatorAccount({ AccountName }: any) {
    const { data } = await this.dauth.delAuthenticatorAccount({ AccountName });
    return data;
  }
  async refreshAuthenticatorTime({ AccountName }: any) {
    const { data } = await this.dauth.refreshAuthenticatorTime({ AccountName });
    return data;
  }
}

export default new Account();
