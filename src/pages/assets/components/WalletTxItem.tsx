import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { hideStr } from '@/lib/utils';
import {  WalletTxItem } from '@/store';
import { useTranslation } from 'react-i18next';
interface WalletTxItemProps {
  item: WalletTxItem;
  onClick?: () => void;
}
export const WalletTransferItem = ({ item, onClick }: WalletTxItemProps) => {
  const { t } = useTranslation()
  return (
    <div
      className='h-20 px-2 py-1 mb-1 tx-item-box'
      onClick={() => onClick?.()}>
      <div className='flex h-full items-center'>
        {item.type === 0 ? (
          <Icon icon='mdi:arrow-down-bold-circle-outline' className='text-3xl mr-4 text-green-500'/>
        ) : (
          <Icon icon='mdi:arrow-up-bold-circle-outline' className='text-3xl mr-4 text-blue-500'/>
        )}
        <div className='flex-1'>
          <div className='mb-1 text-sm flex justify-between items-center'>
            <span>{item.type === 0 ? t('pages.assets.receiver.title') : t('pages.assets.transfer.sender')}</span>
            <div className='text-base text-right'>
              {item.amount}
            </div>
          </div>
          {/* {!!item.fee && (
            <div className='flex justify-between mb-1 text-xs text-gray-500'>
              <span>{t('pages.assets.transfer.gas')}</span>
              <span>{item.fee}</span>
            </div>
          )} */}
          
          <div className='flex justify-between mb-1 text-xs text-gray-500'>
            <span>{item.type === 0 ? t('pages.assets.transfer.send_address') : t('pages.assets.transfer.receive_address')}{hideStr(item.address, 4)}</span>
            <span>{format(item.txTime, 'HH:mm:ss')}</span>
          </div>

          {/* <div className='flex justify-between'>
            <div className='text-xs text-gray-500'>
              {format(item.txTime, 'MM-dd HH:mm:ss')}
            </div>
          </div> */}
        </div>
        {/* <div>
          <div className='text-sm text-gray-400'>
            {item.type === 0 ? hideStr(item.sender, 4) : ''}
          </div>
        </div> */}
      </div>
    </div>
  );
};
