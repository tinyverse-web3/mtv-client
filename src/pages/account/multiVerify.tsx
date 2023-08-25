import { useState, useEffect, useTransition } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import { toast } from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ValidPassword } from '@/components/ValidPassword';
import { useTranslation } from 'react-i18next';

export default function MultiVerify() {
  const { t } = useTranslation()
  const nav = useNavigate();
  const [type, setType] = useState(0);
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const { accountInfo, delAccount } = useAccountStore((state) => state);

  const toPrivateData = async () => {
    nav(ROUTE_PATH.ACCOUNT_PRIVATEDATA);
  };
  const toProtector = async () => {
    if (!accountInfo.hasFeatureData) {
      toast(t('pages.account.toast.no_private'));
      return;
    }
    const loginStatus = await useCheckLogin();
    console.log('loginStatus', loginStatus);
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_PROTECTOR);
    }
  };
  const validPasswordSuccess = (password: string) => {
    if (type === 1) {
      toPrivateData();
    } else if (type === 2) {
      toProtector();
    }
  };
  const showVerifyPassword = (type: 1 | 2) => {
    setShowPasswordStatus(true);
    setType(type);
  };
  return (
    <LayoutThird showBack title={t('pages.account.multi_verify.title')}>
      <div className='p-4'>
        <ListRow label={t('pages.account.encrypted_safe.title')} onPress={() => showVerifyPassword(1)} />
        <ListRow label={t('pages.account.protector.title')} onPress={() => showVerifyPassword(2)} />
      </div>
      <ValidPassword
        onSuccess={validPasswordSuccess}
        show={showPasswordStatus}
        onClose={() => setShowPasswordStatus(false)}
      />
    </LayoutThird>
  );
}
