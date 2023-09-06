import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetworkStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';
import { IndexItem } from './components/IndexItem';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
export default function NetworIndex() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { summary, getSummary } = useNetworkStore((state) => state);
  const toDkvsExpansion = () => {
    toast(t('pages.space.hint.coming_soon'));
  };
  const toIpfsExpansion = () => {
    toast(t('pages.space.hint.coming_soon'));
  };
  const toIpfsList = () => {
    nav(`${ROUTE_PATH.SPACE_NETWORK_LIST}?type=ipfs`);
  };
  const toDkvsList = () => {
    nav(`${ROUTE_PATH.SPACE_NETWORK_LIST}?type=dkvs`);
  };

  const ipfsSummary = useMemo(() => {
    const ipfs = summary.find((item: any) => item.DataType === 'ipfs');
    if (!ipfs) return {};
    return {
      type: 'ipfs',
      totalSpace: 1024 * 1024 * 100,
      used: ipfs.UsedSpace,
      total: 20,
      usedItem: ipfs.totalItem,
    };
  }, [summary]);
  const dkvsSummary = useMemo(() => {
    const dkvs = summary.find((item: any) => item.DataType === 'dkvs');
    if (!dkvs) return {};

    return {
      type: 'dkvs',
      totalSpace: 1024 * 1024,
      used: dkvs.UsedSpace,
      total: 20,
      usedItem: dkvs.totalItem,
    };
  }, [summary]);
  useEffect(() => {
    getSummary();
  }, []);
  return (
    <LayoutThird title={t('pages.space.data.title')}>
      <div className='p-4'>
        <div className='mb-4'>
          <IndexItem
            title='IPFS'
            type='ipfs'
            summary={ipfsSummary}
            toExpansion={toIpfsExpansion}
            toDetail={toIpfsList}
          />
        </div>
        <div className='mb-4'>
          <IndexItem
            title='DKVS'
            type='dkvs'
            summary={dkvsSummary}
            toExpansion={toDkvsExpansion}
            toDetail={toDkvsList}
          />
        </div>
        <div className='border-1 border-solid border-gray-2 p-2 rounded-2 mb-6 text-[14px]'>
          {t('pages.space.data.hint')}
        </div>
      </div>
    </LayoutThird>
  );
}
