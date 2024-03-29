import { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import account from '@/lib/account/account';
import { hideStr } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
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
  const { t } = useTranslation();
  const typeTextMap: any = {
    '0': t('pages.space.award.index_valut'),
    '1': t('pages.space.award.index_guardian'),
    '2': t('pages.space.award.index_password'),
    '3': t('pages.space.award.index_backup'),
    '4': t('pages.space.award.index_invite'),
    '5': t('pages.space.award.index_subaccount'),
    '6': t('pages.space.award.index_experience'),
    '7': t('pages.space.award.index_daily'),
  };
  const invokeReward = async () => {
    const { code, data, msg } = await account.invokeReward(item.RewardID);
    if (code === '000000') {
      toast.success(t('pages.space.award.apply_success'));
    } else {
      toast.error(msg);
    }
  };
  const text = useMemo(() => {
    const t = item.RewardType || 0;
    return typeTextMap[t];
  }, [item.RewardType]);
  return (
    <div className='h-16 px-2' onClick={() => onClick?.()}>
      <div className='flex h-full items-center'>
        <div className='flex p-2 border-blue-700 border-1 rounded-full justify-center  mr-4'>
          <Icon
            icon='streamline:shopping-gift-reward-box-social-present-gift-media-rating-bow'
            className='text-xl text-blue-700'
          />
        </div>
        <div
          className={`flex-1 h-full flex flex-col justify-center ${
            bordered ? 'border-b-1 border-gray-200' : ''
          }`}>
          <div className='mb-1 text-sm flex justify-between items-center'>
            <span>{text}</span>
            <div className='text-base text-right'>+{item.Score}</div>
          </div>

          <div className='flex justify-between text-xs text-gray-500'>
            {!!item.InvokeTime && (
              <div className=''>
                {format(item.InvokeTime * 1000, 'yyyy-MM-dd HH:mm:ss')}
              </div>
            )}
            <div className=''>
              {item.invoked == 1 ? (
                t('pages.space.award.detail.yes')
              ) : (
                <div className='flex items-center' onClick={invokeReward}>
                  <span className='text-red-500'>
                    {' '}
                    {t('pages.space.award.detail.no')}
                  </span>
                  <Icon
                    icon='tdesign:refresh'
                    className='text-xl ml-2 text-blue-700'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
