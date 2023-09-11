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
  const openUrl = (url: string) => {
    if (window.JsBridge) {
      window.JsBridge.accessLink(url, ({ code }: any) => {});
    } else {
      location.href = url;
    }
  };
  const toService = () => {
    const url =
      i18n.language === 'en'
        ? 'https://tinyverse.space/service.html'
        : 'https://cn.tinyverse.space/service.html';
    openUrl(url);
  };

  const toWebsit = () => {
    console.log(i18n.language);
    const url =
      i18n.language === 'en'
        ? 'https://tinyverse.space'
        : 'https://cn.tinyverse.space';
    openUrl(url);
  };
  const toGithub = () => {
    const url = 'https://github.com/tinyverse-web3';
    openUrl(url);
  };
  const toPrivacy = () => {
    const url =
      i18n.language === 'en'
        ? 'https://tinyverse.space/privacy.html'
        : 'https://cn.tinyverse.space/privacy.html';
    openUrl(url);
  };
  return (
    <LayoutThird showBack title={t('pages.account.about.title')}>
      <div className='h-full relative'>
        <div className='p-4'>
          <div className='pt-8 mb-6 flex flex-col items-center'>
            <Image src='/logo.png' className='w-20 h-20 mb-2' />
            <div className='mb-2'>{t('pages.account.about.version')}</div>
            <div className='mb-2 text-xs'>
              {t('pages.account.about.description')}
            </div>
          </div>
          <div>
            <ListRow
              label={t('pages.account.about.btn_1')}
              onPress={toService}
            />
            <ListRow
              label={t('pages.account.about.btn_2')}
              onPress={toPrivacy}
            />
            <ListRow
              label={t('pages.account.about.btn_3')}
              onPress={toGithub}
            />
            <ListRow
              label={t('pages.account.about.btn_4')}
              onPress={toWebsit}
            />
          </div>
        </div>
        <div className='absolute text-center w-full text-xs bottom-6'>
          Copyright © 2023 TinyVerse Ltd. All Rights Reserved.
        </div>
      </div>
    </LayoutThird>
  );
}
