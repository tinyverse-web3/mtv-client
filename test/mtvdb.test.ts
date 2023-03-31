import { describe, it, beforeEach } from "mocha";
import { assert, expect } from "chai";
import { MtvDb } from '../src/lib/mtv-db';
import CryptoJS from 'crypto-js';

//编写测试套件
describe('MTVDB Test Suite', () => {
   const privateKey = '5f39cceb470cbc0b9259a0099a5238f3cc069858f8275802c17b37bf545d6df2';
   const dbAddress = '/orbitdb/zdpuAmbXnVrBYvjhUCXG6hTzKHUiNug8KvvXzPnaoZYBV6bQT/mtv_kv';
   const metadataKey = 'kzwfwjn5ji4pupd2pb0qcfwlah3qc9ud9w2n1d3vgesiiidv1uk7t1wfx5ntb6w';
   const v001 = {
      personalInfo: { myname: 'jack', weight: '120' }
    };
   let mtvdb: MtvDb;
   beforeEach(() => {
      mtvdb = MtvDb.getInstance();
      const sk = CryptoJS.SHA256(privateKey,).toString();
      mtvdb.createInstance(sk, dbAddress, metadataKey);
   });
   it('put key-value test', async () => {
      await mtvdb.put('k001', JSON.stringify(v001));
      const result = await mtvdb.get('k001');
      assert.equal(result, v001.personalInfo.myname);
   })
    
});