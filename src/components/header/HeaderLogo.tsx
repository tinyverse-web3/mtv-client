import { Text, Image } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export const HeaderLogo = () => {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <div className='flex items-center justify-center mb-8'>
        <Image src='/logo.png' className='w-14 h-14 mx-0' />
        <Text className='text-7 ml-2 font-500 tracking-0.4'>
          {t('app.title')}
        </Text>
      </div>
      <Text className='text-center text-11px mb-14 text-4 leading-5 tracking-0.2'>
        {t('app.subtitle')}{t('app.description')}
      </Text>
    </div>
  );
};
