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
  const [loading, setLoading] = useState(false);
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
      totalSpace: ipfs.TotalSpace,
      used: ipfs.UsedSpace,
      total: 20,
      usedItem: ipfs.UsedItem || 0,
    };
  }, [summary]);
  const dkvsSummary = useMemo(() => {
    const dkvs = summary.find((item: any) => item.DataType === 'dkvs');
    if (!dkvs) return {};

    return {
      type: 'dkvs',
      totalSpace: dkvs.TotalSpace,
      used: dkvs.UsedSpace,
      total: dkvs.TotalItem,
      usedItem: dkvs.UsedItem,
    };
  }, [summary]);
  const getDataSummary = async () => {
    if (!summary?.length) {
      setLoading(true);
    }
    await getSummary();
    setLoading(false);
  };
  useEffect(() => {
    getDataSummary();
  }, []);
  return (
    <LayoutThird title={t('pages.space.data.title')} loading={loading}>
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
        <div className='border-1 border-solid border-gray-2 p-2 rounded-lg mb-6 text-sm'>
          {t('pages.space.data.hint')}
        </div>
      </div>
    </LayoutThird>
  );
}
