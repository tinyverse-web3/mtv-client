import React, { useEffect, useState } from 'react';
import { ListItem } from './components/ListItem';
import { Input } from '@/components/form/Input';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

const NetworkList: React.FC = () => {
  const { t } = useTranslation();
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
    nav(
      `${ROUTE_PATH.SPACE_NETWORK_DETAIL}?type=${type}&id=${encodeURIComponent(
        e.Key,
      )}&cid=${e.Cid}`,
    );
  };
  useEffect(() => {
    getList();
  }, [type]);
  return (
    <LayoutThird title={t('pages.space.data.title')}>
      <div className='p-4'>

        {networkItems.map((item, index) => (
          <ListItem
            key={index}
            Key={item.Key}
            type={type as string}
            Size={item.Size}
            PinStatus={item.PinStatus}
            Redundancy={item.Redundancy}
            CreateTime={item.CreateTime}
            expireTime={item.ExpireTime}
            Cid={item.Cid}
            description={item.Description}
            onClick={() => toDetail(item)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>
    </LayoutThird>
  );
};

export default NetworkList;
