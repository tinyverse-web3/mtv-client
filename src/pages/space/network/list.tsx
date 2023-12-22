import React, { useEffect, useMemo, useState } from 'react';
import { ListItem } from './components/ListItem';
import { Empty } from '@/components/Empty';
import { useNetworkStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

const NetworkList: React.FC = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const type = params.get('type');
  const { ipfsList, dkvsList, getIpfsList, getDkvsList } = useNetworkStore(
    (state) => state,
  );
  const toDetail = (e: any) => {
    nav(
      `${ROUTE_PATH.SPACE_NETWORK_DETAIL}?type=${type}&id=${encodeURIComponent(
        e.Key,
      )}${e.Cid ? '&cid=' + e.Cid : ''}`,
    );
  };
  const list = useMemo(() => {
    if (type === 'ipfs') {
      return ipfsList;
    } else if (type === 'dkvs') {
      return dkvsList;
    }
    return [];
  }, [type, ipfsList, dkvsList]);
  useEffect(() => {
    if (type === 'ipfs') {
      getIpfsList();
    } else if (type === 'dkvs') {
      getDkvsList();
    }
  }, [type]);
  return (
    <LayoutThird title={t('pages.space.data.title')}>
      <div className='p-4'>
        {!list?.length && <Empty />}
        {list?.map((item, index) => (
          <ListItem
            key={index + '_' + item.PinStatus}
            Key={item.Key}
            type={type as string}
            Size={item.Size}
            PinStatus={item.PinStatus}
            Redundancy={item.Redundancy}
            CreateTime={item.CreateTime}
            ValidTime={item.ValidTime}
            Cid={item.Cid}
            description={item.Description}
            onClick={() => toDetail(item)}
          />
        ))}
      </div>
    </LayoutThird>
  );
};

export default NetworkList;
