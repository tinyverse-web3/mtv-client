import { Button } from '@/components/form/Button';
import LayoutOne from '@/layout/LayoutOne';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { LanguageIcon } from '@/components/SettingIcon';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useGlobalStore,
  useAuthenticatorStore,
  useAlbumStore,
  useAssetsStore,
  useFileStore,
  useNetworkStore,
  useAccountStore,
  useChatStore,
  useNoteStore,
  useGunStore,
  usePasswordStore,
  useRestoreStore,
  useQuestionStore,
} from '@/store';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { getLocalAccountInfo, delAccount } = useAccountStore((state) => state);
  const [loading, setLoading] = useState(false);
  const { VITE_TINY_WEB } = import.meta.env;
  const { reset: resetChat } = useChatStore((state) => state);
  const { reset: resetAuthenticator } = useAuthenticatorStore((state) => state);
  const { reset: resetAlbum } = useAlbumStore((state) => state);
  const { reset: resetAssets } = useAssetsStore((state) => state);
  const { reset: resetFile } = useFileStore((state) => state);
  const { reset: resetNetwork } = useNetworkStore((state) => state);
  const { reset: resetNote } = useNoteStore((state) => state);
  const { reset: resetGun } = useGunStore((state) => state);
  const { reset: resetpassword } = usePasswordStore((state) => state);
  const { reset: resetRestore } = useRestoreStore((state) => state);
  const { reset: resetQuestion } = useQuestionStore((state) => state);
  const { reset: resetGlobal, setLockStatus } = useGlobalStore(
    (state) => state,
  );
  const { t } = useTranslation();
  const nav = useNavigate();
  const toRestore = async () => {
    await deleteUser();
    if (window.JsBridge) {
      window.JsBridge?.clearBiometrics();
    }
    nav(ROUTE_PATH.RESTORE);
  };
  const toCreate = () => {
    create();
  };
  const openUrl = (url: string) => {
    if (window.JsBridge) {
      window.JsBridge?.accessLink(url, ({ code }: any) => {});
    } else {
      location.href = url;
    }
  };

  const deleteUser = async () => {
    await Promise.all([
      resetGlobal(),
      resetAuthenticator(),
      resetAlbum(),
      resetAssets(),
      resetFile(),
      resetNetwork(),
      delAccount(),
      resetChat(),
      resetNote(),
      resetGun(),
      resetpassword(),
      resetRestore(),
      resetQuestion(),
    ]);
    localStorage.clear();
  };
  const toWebsit = () => {
    openUrl(VITE_TINY_WEB);
  };
  const create = async () => {
    setLoading(true);
    await deleteUser();
    console.time('create account');
    const { code, msg } = await account.create();
    if (code !== '000000') {
      toast.error(msg);
      setLoading(false);
      return;
    }
    if (window.JsBridge) {
      window.JsBridge.clearBiometrics();
    }
    setLockStatus(false);
    await getLocalAccountInfo();
    setLoading(false);
    console.timeEnd('create account');
    nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
  };
  return (
    <LayoutOne className='relative'>
      <div className='absolute right-2 top-2'>
        <LanguageIcon />
      </div>

      <div className='pt-16 px-6'>
        <HeaderLogo />
        <Button
          fullWidth
          size="lg"
          onPress={toCreate}
          className='mb-2'
          loading={loading}>
          {t('pages.index.btn_create')}
        </Button>
        <div className='text-xs mb-4'>{t('pages.index.create_hint')}</div>
        <Button
          color='secondary'
          fullWidth
          size="lg"
          className='mb-4'
          onPress={toRestore}
          >
          {t('pages.index.btn_restore')}
        </Button>
        <div className='flex justify-end'>
          <div onClick={toWebsit} className='text-blue-600'>
            {t('pages.index.btn_more')}
          </div>
        </div>
      </div>
    </LayoutOne>
  );
}
