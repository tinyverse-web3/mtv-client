import {  Image } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export const HeaderLogo = () => {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <div className='flex items-center justify-center mb-8'>
        <Image src='/logo.png' className='w-14 h-14' />
        <div className='text-3xl ml-2 font-500 tracking-0.4'>
          {t('app.title')}
        </div>
      </div>
      <div className='text-center text-sm mb-10 leading-5 tracking-0.2'>
        {t('app.subtitle')}{t('app.description')}
      </div>
    </div>
  );
};
