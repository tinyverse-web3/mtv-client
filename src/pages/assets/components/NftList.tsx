import account from '@/lib/account/account';
import { useEffect, useState } from 'react';
import { AssetsNftItem } from './AssetsNftItem';
export const NftList = () => {
  const [list, setList] = useState<any[]>([
    // {
    //   Nftname:
    //     '659f0ecbdfcad86b50c02176f978836ab33707d512f7855fab7e840974675cf5',
    //   Name: 'IMG_20230801_175247.PNG',
    //   DataType: 'image/png',
    //   Cid: 'QmfUM8m4sZrRxwkdYEzL29Yj8UwSCmyx1ZQ5TnkPFfnKe6',
    //   Data: null,
    //   Owner: 'CAESIOhjkWkNhpuTxoCjwmVl8dALULDJDrhP9r6ZdqVj4dKO',
    //   Description: 'IMG_20230801_175247.PNG',
    // },
  ]);
  const getList = async () => {
    const { data, code } = await account.getNftList();
    console.log(data);
    if (code === '000000') {
      if (data?.length) {
        setList(data);
      }
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className='grid grid-cols-3 grid-gap-6'>
      {list.map((item) => (
        <AssetsNftItem icon={item.Cid} key={item.Cid} />
      ))}
    </div>
  );
};
