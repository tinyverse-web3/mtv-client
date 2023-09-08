import { Button } from '@/components/form/Button';
import LayoutOne from '@/layout/LayoutOne';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { LanguageIcon } from '@/components/SettingIcon';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useGlobalStore,
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
  const { VITE_DEFAULT_PASSWORD, VITE_TINY_WEB } = import.meta.env;
  const { reset: resetChat } = useChatStore((state) => state);
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
          size='xl'
          className='m-auto mb-2 w-full h-50px bg-blue-4'
          onPress={toCreate}
          loading={loading}>
          {t('pages.index.btn_create')}
        </Button>
        <div className='text-13px mb-4'>{t('pages.index.create_hint')}</div>
        <Button
          color='secondary'
          className='m-auto mb-4 w-full h-50px bg-blue-6'
          onPress={toRestore}
          size='xl'>
          {t('pages.index.btn_restore')}
        </Button>
        <div className='flex justify-end'>
          <div onClick={toWebsit} className='text-blue-9'>
            {t('pages.index.btn_more')}
          </div>
        </div>
      </div>
    </LayoutOne>
  );
}
