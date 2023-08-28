import { useMemo } from 'react';
import { format } from 'date-fns';
import { GunSummy } from '@/store';
import { add, getTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const GunItem = (item: GunSummy) => {
  const { t } = useTranslation();
  let color = '';
  const today = new Date();
  const tomorrow = getTime(add(today, { days: 1 }));
  if (item.expired > tomorrow) {
    color = '#11EE11';
  } else if (item.expired < getTime(today)) {
    color = '#EE3D11';
  } else {
    color = '#DDB822';
  }
  const style = { color: color };

  const exporedText = useMemo(() => {
    return format(item.expired, 'yyyy-MM-dd');
  }, [item.expired]);
  return (
    <div className='px-2 flex justify-between items-center'>
      <div className=''>
        <div className='flex items-center text-4 mb-1'>{item.name}</div>

        <div className='text-3 text-gray-800'>
          <span className='font-600'>{t('pages.space.gun.expired_text')}：</span>
          {exporedText}
        </div>
      </div>
      <div className='i-mdi-chevron-right w-6 h-6'></div>
    </div>
  );
};
