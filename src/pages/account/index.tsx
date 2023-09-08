import { useState, useMemo } from 'react';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { Image } from '@nextui-org/react';
import { useGlobalStore, useAccountStore } from '@/store';
import { UserAvatar, ListRow, UserLevel } from './components';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';
import { ValidPassword } from '@/components/ValidPassword';
import { PasswordWarnBadge } from '@/components/PasswordWarnBadge';

export default function Account() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const { accountInfo } = useAccountStore((state) => state);
  const { reset: resetGlobal, setLockStatus } = useGlobalStore(
    (state) => state,
  );
  const { delAccount: resetAccount } = useAccountStore((state) => state);

  const [type, setType] = useState(0);
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const toPublicKey = () => {
    nav(ROUTE_PATH.ACCOUNT_PUBLICKEY);
  };

  const toProfile = async () => {
    nav(ROUTE_PATH.ACCOUNT_PROFILE);
  };
  const deleteUser = async () => {
    await Promise.all([resetGlobal(), resetAccount()]);
    await account.lock();
    setLockStatus(true);
    nav(ROUTE_PATH.UNLOCK);
  };
  const toLocalSafe = () => {
    nav(ROUTE_PATH.ACCOUNT_LOCAL_SAFE);
  };
  const toMultiVerify = () => {
    nav(ROUTE_PATH.ACCOUNT_MULTI_VERIFY);
  };
  const toRestory = () => {
    nav(ROUTE_PATH.ACCOUNT_RESTORY);
  };
  const toAbout = () => {
    nav(ROUTE_PATH.ACCOUNT_ABOUT);
  };
  const toSetting = () => {
    nav(ROUTE_PATH.SETTING_INDEX);
  };
  const showVerifyPassword = (type: 1 | 2) => {
    setShowPasswordStatus(true);
    setType(type);
  };
  const validPasswordSuccess = (password: string) => {
    if (type === 1) {
      toMultiVerify();
    } else if (type === 2) {
      toRestory();
    }
  };
  const imageSrc = useMemo(() => {
    return accountInfo.avatar
      ? `${apiHost}/sdk/msg/getAvatar?DestPubkey=${accountInfo.publicKey}`
      : '/logo.png';
  }, [accountInfo.avatar]);
  return (
    <div className='p-4 pt-4 text-14px'>
      <PasswordWarnBadge />
      <div className='flex mb-4'>
        <Image
          src={imageSrc}
          className='rounded-full w-20 h-20 min-w-[5rem] mr-4 overflow-hidden'
        />
        <UserLevel />
      </div>
      <ListRow label={t('pages.account.profile.title')} onPress={toProfile} />
      <ListRow
        label={t('pages.account.local_safe.title')}
        onPress={toLocalSafe}
      />
      <ListRow
        label={t('pages.account.multi_verify.title')}
        onPress={() => showVerifyPassword(1)}
      />
      <ListRow
        label={t('pages.account.restore.title')}
        onPress={() => showVerifyPassword(2)}
      />
      <ListRow label={t('pages.account.setting.title')} onPress={toSetting} />
      <ListRow label={t('pages.account.about.title')} onPress={toAbout} />
      <ListRow label={t('pages.account.exit.title')} onPress={deleteUser} />
      <ValidPassword
        onSuccess={validPasswordSuccess}
        show={showPasswordStatus}
        onClose={() => setShowPasswordStatus(false)}
      />
    </div>
  );
}
