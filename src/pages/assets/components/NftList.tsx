import account from '@/lib/account/account';
import { useEffect, useState } from 'react';
import { AssetsNftItem } from './AssetsNftItem';
export const NftList = () => {
  const [list, setList] = useState<any[]>([]);
  const getList = async () => {
    const { data, code } = await account.getNftList();
    if (code === '000000') {
      if (data?.length === 0) {
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
        <AssetsNftItem icon='/logo.png' />
      ))}
    </div>
  );
};
