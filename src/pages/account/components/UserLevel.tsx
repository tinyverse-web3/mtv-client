import { useMemo } from 'react';
import { useAccountStore } from '@/store';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
}
export const UserLevel = ({ className }: Props) => {
  const { t } = useTranslation();
  const levelArr = [
    {
      level: 0,
      text: t('pages.account.level.zero'),
    },
    {
      level: 1,
      text: t('pages.account.level.one'),
    },
    {
      level: 2,
      text: t('pages.account.level.two'),
    },
    {
      level: 3,
      text: t('pages.account.level.three'),
    },
    {
      level: 4,
      text: t('pages.account.level.four'),
    },
    {
      level: 5,
      text: t('pages.account.level.five'),
    },
  ];
  const { accountInfo } = useAccountStore((state) => state);
  const levelItem = useMemo(
    () => levelArr[accountInfo.safeLevel || 0],
    [accountInfo],
  );
  return (
    <div className={`${className}`}>
      <div className='flex items-center mb-1 flex-wrap text-sm'>
        <Popover>
          <PopoverTrigger>
            <span>{t('pages.account.level.title')}：</span>
          </PopoverTrigger>
          <PopoverContent>
            <div className='p-2'>{t('pages.account.level.hint_one')}</div>
          </PopoverContent>
        </Popover>

        <div className='flex-1 overflow-hidden'>
          <div className='h-5 bg-gray-100 w-50 max-w-full rounded-full overflow-hidden'>
            <div
              className={`h-full flex justify-center items-center text-xs bg-blue-600 rounded-full text-white min-w-[1.25rem]`}
              style={{ width: `${20 * levelItem.level}%` }}>
              {levelItem.level}
            </div>
          </div>
        </div>
      </div>
      <div className='text-gray-600 text-xs'>
        <p >{levelItem.text}</p>
        <p >{t('pages.account.level.hint')}</p>
      </div>
    </div>
  );
};
