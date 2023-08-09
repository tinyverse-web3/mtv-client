import React, { useEffect, useState } from 'react';
import { ListItem } from './components/ListItem';
import { Input } from '@/components/form/Input';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';

const NetworkList: React.FC = () => {
  const nav = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [params] = useSearchParams();
  const type = params.get('type');
  const [networkItems, setNetworkItems] = useState<any[]>([]);
  const getList = async () => {
    if (type) {
      const { data, code } = await account.getDataList(type);
      if (code === '000000') {
        if (data?.length) {
          setNetworkItems(data);
        }
      }
    }
  };
  const handleDelete = (index: number) => {
    const newNetworkItems = [...networkItems];
    newNetworkItems.splice(index, 1);
    setNetworkItems(newNetworkItems);
  };
  const toDetail = (e: any) => {
    nav(`${ROUTE_PATH.SPACE_NETWORK_DETAIL}?type=${type}&id=${encodeURIComponent(e.Key)}`);
  };
  useEffect(() => {
    getList();
  }, [type]);
  return (
    <LayoutThird title='网络数据'>
      <div className='p-4'>
        {/* <div className='mb-4'>
          <Input
            value={searchText}
            aria-label='text'
            onChange={(e: any) => setSearchText(e.target)}
            fullWidth
            clearable
            rounded
            onKeyUp={searchHandler}
            placeholder='对方公钥'
          />
        </div> */}

        {networkItems.map((item, index) => (
          <ListItem
            key={index}
            Key={item.Key}
            Size={item.Size}
            Redundancy={item.Redundancy}
            CreateTime={item.CreateTime}
            // expireTime={item.expireTime}
            // description={item.description}
            onClick={() => toDetail(item)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>
    </LayoutThird>
  );
};

export default NetworkList;