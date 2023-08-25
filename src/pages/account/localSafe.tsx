import { useState, useEffect } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import { toast } from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ValidPassword } from '@/components/ValidPassword';
import { useTranslation } from 'react-i18next';

export default function LocalSafe() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [isBiometricsSatus, setIsBiometricsSatus] = useState(false);
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const { accountInfo, delAccount } = useAccountStore((state) => state);

  const toChangePwd = async () => {
    if (!accountInfo.hasFeatureData) {
      toast(t('pages.account.toast.no_private'));
      return;
    }
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_CHANGE_PWD);
    }
  };
  const setupBiometrics = async (password: string) => {
    window?.JsBridge.setupBiometrics(password, ({ code, message }: any) => {
      if (code === 0) {
        toast.success(message);
        setIsBiometricsSatus(true);
      } else {
        toast.error(message);
      }
    });
  };
  const validPasswordSuccess = (password: string) => {
    setupBiometrics(password);
  };
  const getBiometricsSetUp = () => {
    if (window?.JsBridge) {
      window?.JsBridge.isBiometricsSetUp(({ code, message }: any) => {
        if (code === 0) {
          setIsBiometricsSatus(true);
        } else {
          setIsBiometricsSatus(false);
        }
      });
    }
  };
  useEffect(() => {
    getBiometricsSetUp();
  }, []);
  return (
    <LayoutThird showBack title={t('pages.account.local_safe.title')}>
      <div className='p-4'>
        <ListRow label={t('common.password.change')} onPress={toChangePwd} />
        <ListRow
          label={t('common.biometrics.title')} 
          value={isBiometricsSatus ? t('common.turn_on') : t('common.turn_off')}
          onPress={() => setShowPasswordStatus(true)}
        />
      </div>
      <ValidPassword
        onSuccess={validPasswordSuccess}
        show={showPasswordStatus}
        showBiometric={false}
        onClose={() => setShowPasswordStatus(false)}
      />
    </LayoutThird>
  );
}
