import { useState } from 'react';
import { Image } from '@nextui-org/react';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';
import LayoutThird from '@/layout/LayoutThird';
import { ValidPassword } from '@/components/ValidPassword';

export default function Account() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { VITE_TINY_WEB } = import.meta.env;
  const [loading, setLoading] = useState(false);
  const toWebsit = () => {
    location.href = VITE_TINY_WEB;
  }
  return (
    <LayoutThird showBack title={t('pages.account.about.title')}>
      <div className='h-full relative'>
        <div className='p-4'>
          <div className='pt-8 mb-6 text-center'>
            <Image src='/logo.png' className='w-20 h-20 mb-2' />
            <div className='mb-2'>{t('pages.account.about.version')}</div>
            <div className='mb-2 text-12px'>
              {t('pages.account.about.description')}
            </div>
          </div>
          <div>
            <ListRow label={t('pages.account.about.btn_1')} />
            <ListRow label={t('pages.account.about.btn_2')} />
            <ListRow label={t('pages.account.about.btn_3')} />
            <ListRow label={t('pages.account.about.btn_4')} onPress={toWebsit}/>
          </div>
        </div>
        <div className='absolute text-center w-full text-12px'>
          Copyright © 2023 TinyVerse Ltd. All Rights Reserved.
        </div>
      </div>
    </LayoutThird>
  );
}
