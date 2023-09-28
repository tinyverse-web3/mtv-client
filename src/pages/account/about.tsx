import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/react';
import account from '@/lib/account/account';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import { useTranslation } from 'react-i18next';
import LayoutThird from '@/layout/LayoutThird';

export default function Account() {
  const nav = useNavigate();
  const [version, setVersion] = useState('');
  const [newVersion, setNewVersion] = useState(false);
  const { t, i18n } = useTranslation();
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
  const getLatestVersion = async () => {
    if (window.JsBridge) {
      window.JsBridge.getAppVersion(({ data }: any) => {
        setVersion(data);
      });
    }
  };
  const checkVersion = async () => {
    const { code, data, msg } = await account.checkVersion(version);
    setNewVersion(code === '000000' && data);
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
  const toBlog = () => {
    const url = 'https://medium.com/@tinyverse_space';
    openUrl(url);
  };
  useEffect(() => {
    checkVersion();
  }, [version]);
  useEffect(() => {
    getLatestVersion();
  }, []);
  const toPrivacy = () => {
    const url =
      i18n.language === 'en'
        ? 'https://tinyverse.space/privacy.html'
        : 'https://cn.tinyverse.space/privacy.html';
    openUrl(url);
  };
  const toDownload = () => {
    const url = import.meta.env.VITE_DOWONLOAD;
    openUrl(url);
  };
  const toTwitter = () => {
    const url = 'https://twitter.com/tinyverse_space';
    openUrl(url);
  }
  return (
    <LayoutThird showBack title={t('pages.account.about.title')}>
      <div className='h-full relative'>
        <div className='p-4'>
          <div className='pt-8 mb-6 flex flex-col items-center'>
            <Image src='/logo.png' className='w-20 h-20 mb-2' />
            <div className='mb-2 flex items-center'>
              {t('pages.account.about.version')}{version}
            </div>
            <div className='mb-2 text-xs'>
              {t('pages.account.about.description')}
            </div>
          </div>
          <div>
            <ListRow
              label={t('pages.account.about.btn_0')}
              onPress={toDownload}
              value={
                newVersion && (
                  <span className='text-red-600'>
                    {t('pages.account.about.version_new')}
                  </span>
                )
              }
            />
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
            <ListRow label={t('pages.account.about.btn_5')} onPress={toBlog} />
            <ListRow label={t('pages.account.about.btn_5')} onPress={toTwitter} />
          </div>
        </div>
        <div className='text-center w-full text-xs pb-4'>
          Copyright © 2023 TinyVerse Ltd. All Rights Reserved.
        </div>
      </div>
    </LayoutThird>
  );
}
