import { useState } from 'react';
import { Image } from '@nextui-org/react';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import { useTranslation } from 'react-i18next';
import LayoutThird from '@/layout/LayoutThird';

export default function Account() {
  const nav = useNavigate();
  const { t, i18n } = useTranslation();
  const { VITE_TINY_WEB } = import.meta.env;
  const toService = () => {
    const url = i18n.language === 'en' ? "https://tinyverse.space/service.html" : "https://cn.tinyverse.space/service.html"
    location.href = url;
  }
  const toWebsit = () => {
    console.log(i18n.language);
    const url = i18n.language === 'en' ? "https://tinyverse.space" : "https://cn.tinyverse.space"
    location.href = url;
  }
  const toPrivacy = () => {
    const url = i18n.language === 'en' ? "https://tinyverse.space/privacy.html" : "https://cn.tinyverse.space/privacy.html"
    location.href = url;
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
            <ListRow label={t('pages.account.about.btn_1')} onPress={toService} />
            <ListRow label={t('pages.account.about.btn_2')} onPress={toPrivacy}/>
            <ListRow label={t('pages.account.about.btn_3')} />
            <ListRow label={t('pages.account.about.btn_4')} onPress={toWebsit}/>
          </div>
        </div>
        <div className='absolute text-center w-full text-12px bottom-6'>
          Copyright © 2023 TinyVerse Ltd. All Rights Reserved.
        </div>
      </div>
    </LayoutThird>
  );
}
