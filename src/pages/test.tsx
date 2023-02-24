import { Button } from '@nextui-org/react';
import { MtvDb } from '@/lib/mtv-db';
import { ethers } from 'ethers';
import EthCrypto from 'eth-crypto';

export default function Test() {
  const start = async () => {
    // const privateKey =
    //   '8bf625a828253a687b6d61b81736b42fa5f38b24b48c7efdbae173c53c656f2b';
    const signHash = ethers.solidityPackedKeccak256(
      ['address', 'string'],
      [
        '0x5c821001A235D51b09b73D5fB009e30A474C5388',
        '0x5c821001A235D51b09b73D5fB009e30A474C5388',
      ],
    );
    console.log(signHash);
    const privateKey = '0x78831134a715e9a75a09d0066dc0ed69f0422a778f1acb28623c1398820f8c9b'
    const signMessage = EthCrypto.sign(privateKey, signHash)
    console.log(signMessage);
    // const mtvdb = new MtvDb();
    // await mtvdb.createInstance(privateKey, '');
    // const value001 = {
    //   personalInfo: { myname: 'jack', wehight: '120' },
    // };
    // const put = await mtvdb.put('k001', JSON.stringify(value001));
    // const get = await mtvdb.get('k001');
  };
  return <Button onPress={start}>测试</Button>;
}
