import account from '@/lib/account/account';
import { useEffect, useState } from 'react';
import { AssetsNftItem } from './AssetsNftItem';
import { Empty } from '@/components/Empty';
import { TextTabs } from '@/components/TextTabs';
import { useAssetsStore } from '@/store';

export const NftList = () => {
  const { nftList, getNftList } = useAssetsStore((state) => state);
  const list = [
    {
      label: '图片',
      value: 'image',
    },
    {
      label: '文本',
      value: 'text',
    },
    {
      label: 'GUN',
      value: 'gun',
    },
  ];
  const typeChange = (v: any) => {
    
  }
  useEffect(() => {
    getNftList();
  }, []);
  return (
    <div className=''>
      <div>
        <TextTabs list={list} onChange={typeChange}/>
      </div>
      {!nftList.length && <Empty />}
      {nftList.map((item: any) => (
        <AssetsNftItem item={item} key={item.Cid} />
      ))}
    </div>
  );
};
