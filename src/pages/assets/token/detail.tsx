import LayoutThird from '@/layout/LayoutThird';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePoint } from '@/lib/hooks';
import { useAssetsStore } from '@/store';
import { AssetsTokenDetailItem } from '../components/AssetsTokenDetailItem';
import { TxItem } from '../components/TxItem';
import { ROUTE_PATH } from '@/router';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import account from '@/lib/account/account';
import { useEffect } from 'react';

export default function TokenDetail() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { balance: pointBalance } = usePoint();
  const { tvsTxList, setTvsTxList } = useAssetsStore((state) => state);
  const getTXDetails = async () => {
    const { code, data } = await account.getTXDetails();
    const list = data?.txItems || [];
    setTvsTxList(list);
  };
  const toTransfer = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_TRANSFER);
  };
  useEffect(() => {
    getTXDetails();
  }, []);
  return (
    <LayoutThird title={`TVS ${t('pages.assets.token.detail_title')}`}>
      <div className='bg-gray-50 h-full'>
        <div className='px-4 pt-8'>
          <div className='mb-6'>
            <AssetsTokenDetailItem
              icon='/logo.png'
              symbol={t('pages.assets.token.point_name')}
              key='point'
              balance={pointBalance}
            />
          </div>
          <div className='bg-white h-20 rounded-lg flex '>
            <div
              className='flex flex-col justify-between items-center h-full w-1/2 py-3'
              onClick={toTransfer}>
              <Icon
                icon='mdi:arrow-up-bold-circle-outline'
                className='text-3xl'
              />
              <div className='text-xs text-gray-500'>转账</div>
            </div>
            <div className='flex flex-col justify-between items-center h-full w-1/2 py-3'>
              <Icon icon='mingcute:qrcode-2-line' className='text-3xl' />
              <div className='text-xs text-gray-500'>收款</div>
            </div>
          </div>
        </div>
        <div className='py-4'>

          {
            tvsTxList?.map((item, i) => (
              <TxItem key={i} item={item} />
            ))
          }
        </div>
      </div>
    </LayoutThird>
  );
}
