import { Button } from '@nextui-org/react';
 import { MtvDb } from '@/lib/mtv-db';
// import { ethers } from 'ethers';
// import EthCrypto from 'eth-crypto';
export default function Test() {
  const start = async () => {
    debugger;
    const privateKey = '5f39cceb470cbc0b9259a0099a5238f3cc069858f8275802c17b37bf545d6df2';
    const dbAddress = '/orbitdb/zdpuAq6PqMdtkfL77w66uhnnAkh8vYThK2imdxWtUqxzZGWh2/mtv_kv';
    const metadataKey = 'kzwfwjn5ji4pupd2pb0qcfwlah3qc9ud9w2n1d3vgesiiidv1uk7t1wfx5ntb6w';
    const mtvdb = new MtvDb();
    //await mtvdb.createInstance(privateKey, dbAddress, metadataKey);
    //第一次使用,可以拿到一个dbAddress与metadataKey通过下面接口获取
    //mtvdb.dbAddress
    //mtvdb.metadataKey
    //await mtvdb.createInstance(privateKey);

    //后续使用（）
    await mtvdb.createInstance(privateKey, dbAddress, metadataKey);

    //数据的增改
    const value001 = {
      personalInfo: { myname: 'jack', wehight: '120' },
    };
    const put = await mtvdb.put('k001', JSON.stringify(value001));
    const get = await mtvdb.get('k001');
    await mtvdb.backupDb();
    await mtvdb.closeDb();
  };
  return <Button onPress={start}>测试</Button>;
}
