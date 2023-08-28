import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Progress } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';
import { IndexItem } from './components/IndexItem';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

export default function NetworIndex() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [summary, setSummary] = useState<any>([]);
  useEffect(() => {}, []);
  const toDkvsExpansion = () => {};
  const toIpfsExpansion = () => {};
  const toIpfsList = () => {
    nav(`${ROUTE_PATH.SPACE_NETWORK_LIST}?type=ipfs`);
  };
  const toDkvsList = () => {
    nav(`${ROUTE_PATH.SPACE_NETWORK_LIST}?type=dkvs`);
  };
  const getSummary = async () => {
    const { data, code, msg } = await account.getDataSummary();
    if (code === '000000') {
      setSummary(data);
    }
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
            summary={ipfsSummary}
            toExpansion={toIpfsExpansion}
            toDetail={toIpfsList}
          />
        </div>
        <div>
          <IndexItem
            title='DKVS'
            summary={dkvsSummary}
            toExpansion={toDkvsExpansion}
            toDetail={toDkvsList}
          />
        </div>
      </div>
    </LayoutThird>
  );
}
