import axios from 'axios';

export class AppAccount {
  private readonly app;
  constructor(app = 'mtv') {
    this.app = app;
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
  /**
   * 添加守护者
   */
  async addGuardian({ publicKey, email, verifyCode }: any) {
    return await this.invoke({
      name: 'addGuardian',
      data: {
        publicKey,
        email,
        verifyCode,
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
  async updateName({ publicKey, account }: any) {
    return await this.invoke({
      name: 'updateName',
      data: {
        publicKey,
        account,
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
  async getQuestions({ publicKey }: any) {
    return await this.invoke({
      name: 'getQuestions',
      data: {
        publicKey,
      },
    });
  }
  async saveQuestions({ publicKey, questions }: any) {
    return await this.invoke({
      name: 'saveQuestions',
      data: {
        publicKey,
        questions,
      },
    });
  }
  async invoke({
    name,
    data,
    method = 'post',
  }: {
    name: string;
    data: Record<string, any>;
    method?: string;
  }) {
    data.appName = this.app;
    const url = `http://192.168.3.90:8888/sdk/${name}`;
    return await this.request({ url, method, data });
  }
  async request({ url, method, data, params }: any) {
    return await axios({ url, method, data, params });
  }
}
