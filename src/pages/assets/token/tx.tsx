import LayoutThird from '@/layout/LayoutThird';
import { Card, CardBody } from '@nextui-org/react';
import { CopyIcon } from '@/components/CopyIcon';
import { Button } from '@/components/form/Button';
import { useAccountStore, useAssetsStore } from '@/store';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';

export default function TxDetail() {
  const { t } = useTranslation();
  const { accountInfo } = useAccountStore((state) => state);
  const { currentTx: item } = useAssetsStore((state) => state);
  const copyHandler = () => {};
  return (
    <LayoutThird className='h-full' title={t('pages.assets.tx.title')}>
      <div className='p-4'>
        {!!item && (
          <>
            <div className='flex justify-center mb-1'>
              <Icon
                icon='healthicons:yes-outline'
                className='w-28 h-28 text-blue-500'
              />
            </div>
            {}
            <div className='text-center text-gray-500 mb-1 text-sm'>
              {format(item.txTime, 'yyyy-MM-dd HH:mm:ss')}
            </div>
            <div className='bg-gray-100 rounded-2xl p-2 mb-4 text-sm text-gray-600'>
              {/* {!!item.comment && (
                <div className='flex mb-2'>
                  <span className='mr-4'>明细</span>
                  <span className='break-all flex-1'>{item.comment}</span>
                </div>
              )} */}
              <div className='flex'>
                <span className='mr-4'>{t('pages.assets.tx.gas')}</span>
                <div className='flex'>
                  <span className='mr-1'>{item.gas}</span>
                  <span>{item.transferName?.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className='bg-gray-100 rounded-2xl p-2 text-sm  text-gray-600'>
              <div className='flex  mb-2'>
                <span className='mr-4'>{t('pages.assets.tx.sender')}</span>
                <span className='break-all flex-1'>
                  {item.type === 1 ? accountInfo.address : item.sender}
                </span>
              </div>
              <div className='flex'>
                <span className='mr-4'>{t('pages.assets.tx.receiver')}</span>
                <span className='break-all flex-1'>
                  {item.type === 1
                    ? item.receivers[0].receiver
                    : accountInfo.address}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </LayoutThird>
  );
}
