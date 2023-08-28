import  {useState} from 'react';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore, useAccountStore } from '@/store';
import { UserAvatar, ListRow, UserLevel } from './components';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';
import { ValidPassword } from '@/components/ValidPassword';

export default function Account() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { reset: resetGlobal, setLockStatus } = useGlobalStore(
    (state) => state,
  );
  const [type, setType] = useState(0);
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const toPublicKey = () => {
    nav(ROUTE_PATH.ACCOUNT_PUBLICKEY);
  };

  const toProfile = async () => {
    nav(ROUTE_PATH.ACCOUNT_PROFILE);
  };
  const deleteUser = async () => {
    await resetGlobal();
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
  return (
    <div className='pt-4 px-4 text-14px'>
      <div className='flex mb-4'>
        <UserAvatar className='mr-4' />
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
      <ListRow label={t('pages.account.restore.title')} onPress={() => showVerifyPassword(1)} />
      <ListRow label={t('pages.account.setting.title')} onPress={toSetting} />
      <ListRow label={t('pages.account.about.title')} />
      <ListRow label={t('pages.account.exit.title')} onPress={deleteUser} />
      <ValidPassword
        onSuccess={validPasswordSuccess}
        show={showPasswordStatus}
        onClose={() => setShowPasswordStatus(false)}
      />
    </div>
  );
}
