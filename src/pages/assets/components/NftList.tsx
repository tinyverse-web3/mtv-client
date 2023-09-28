import account from '@/lib/account/account';
import { useEffect, useMemo, useState } from 'react';
import { AssetsNftItem } from './AssetsNftItem';
import { NftImagetem } from './NftImagetem';
import { Empty } from '@/components/Empty';
import { useSearchParams } from 'react-router-dom';
import { TextTabs } from '@/components/TextTabs';
import { useAssetsStore } from '@/store';

export const NftList = () => {
  const { nftList, getNftList } = useAssetsStore((state) => state);
  const [params] = useSearchParams();
  const nftType = params.get('nft');
  const [type, setType] = useState(nftType || 'image'); // ['image', 'text', 'gun'
  const tabList = [
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
    setType(v);
  };
  useEffect(() => {
    getNftList();
  }, []);
  const imageList = useMemo(() => {
    return nftList.filter((v: any) => v.DataType.indexOf('image') > -1);
  }, [nftList]);
  const gunList = useMemo(() => {
    return nftList.filter((v: any) => v.DataType.indexOf('GUN') > -1);
  }, [nftList]);
  const textList = useMemo(() => {
    return nftList.filter((v: any) => v.DataType.indexOf('DATA') > -1);
  }, [nftList]);
  const list = useMemo(() => {
    if (type === 'image') {
      return imageList;
    } else if (type === 'text') {
      return textList;
    } else if (type === 'gun') {
      return gunList;
    }
    return [];
  }, [type, textList, gunList, imageList]);
  return (
    <div className=''>
      <div className='mb-4'>
        <TextTabs value={type} list={tabList} onChange={typeChange} />
      </div>
      {!list.length && <Empty />}
      {type === 'image' ? (
        <div className='grid grid-cols-3 gap-4 justify-items-center'>
          {list.map((item: any) => (
            <NftImagetem item={item} key={item.Cid} />
          ))}
        </div>
      ) : (
        list.map((item: any) => <AssetsNftItem item={item} key={item.Cid} />)
      )}
    </div>
  );
};
