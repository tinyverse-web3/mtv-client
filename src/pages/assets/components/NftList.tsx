import account from '@/lib/account/account';
import { useEffect, useState } from 'react';
import { AssetsNftItem } from './AssetsNftItem';
import { Empty } from '@/components/Empty';
import { useAssetsStore } from '@/store';

export const NftList = () => {
  const { nftList, getNftList } = useAssetsStore( state => state);

  useEffect(() => {
    getNftList();
  }, []);
  return (
    <div className=''>
      {!nftList.length && <Empty />}
      {nftList.map((item: any) => (
        <AssetsNftItem item={item} key={item.Cid} />
      ))}
    </div>
  );
};
