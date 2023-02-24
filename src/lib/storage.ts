import localForage from 'localforage';

export class Storage {
  name: string;
  defaultValue: any;
  constructor(name: string, defaultValue?: any) {
    this.name = name;
    this.defaultValue = defaultValue;
  }
  async get() {
    let result: any;
    try {
      result = await localForage.getItem(this.name);

      if (result === null || result === undefined) {
        result = this.defaultValue;
      } else {
        result = JSON.parse(result);
      }
    } catch (error) {
      result = this.defaultValue;
    }
    return result;
  }
  async set(data: any) {
    try {
      if (data === undefined || data === null || Number.isNaN(data)) return;
      data = JSON.stringify(data);
      await localForage.setItem(this.name, data);
    } catch (error) {
      console.log(error);
    }
  }
}