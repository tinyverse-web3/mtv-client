import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { hideStr } from '@/lib/utils';
interface TxItemProps {
  item: any;
  bordered?: boolean;
  onClick?: () => void;
}
export const DetailItem = ({
  item,
  onClick,
  bordered = false,
}: TxItemProps) => {
  return (
    <div
      className='h-16 px-2'
      onClick={() => onClick?.()}>
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
        <div
          className={`flex-1 h-full flex flex-col justify-center ${bordered ? 'border-b-1 border-gray-200' : ''}`}>
          <div className='mb-1 text-sm flex justify-between items-center'>
            <span>{item.type === 0 ? '收到' : '发送'}</span>
            <div className='text-base text-right'>
              {item.type === 0 ? '+' : '-'}
              {item.amount}
            </div>
          </div>

          <div className='flex justify-between text-xs text-gray-500'>
            <div className=''>{format(item.time, 'yyyy-MM-dd')}</div>
            <div className=''>已入账</div>
          </div>
        </div>
      </div>
    </div>
  );
};
