import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { hideStr } from '@/lib/utils';
interface TxItemProps {
  item: {
    name: string;
    txTime: number;
    gas: string;
    amount: number;
    sender: string;
    receivers: string;
    comment: string;
    type: 0 | 1;
  };
}
export const TxItem = ({ item }: TxItemProps) => {
  return (
    <div className='h-20 bg-white px-4 mb-1'>
      <div className='flex h-full items-center'>
        {item.type === 0 ? (
          <Icon
            icon='mdi:arrow-up-bold-circle-outline'
            className='text-3xl mr-4 text-blue-500'
          />
        ) : (
          <Icon
            icon='mdi:arrow-down-bold-circle-outline'
            className='text-3xl mr-4 text-green-500'
          />
        )}
        <div className='flex-1'>
          <div className='mb-2 text-base'>
            {item.type === 0 ? '收到' : '发送'}
          </div>
          <div className='text-sm text-gray-400'>
            {format(item.txTime, 'MM-dd HH:mm')}
          </div>
        </div>
        <div>
          <div className='mb-2 text-base text-right'>
            {item.type === 0 ? '+' : '-'}
            {item.amount}
          </div>
          <div className='text-sm text-gray-400'>
            {item.type === 0
              ? hideStr(item.sender, 4)
              : hideStr(item.receivers, 10)}
          </div>
        </div>
      </div>
    </div>
  );
};
