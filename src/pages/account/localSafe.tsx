import { useState, useEffect } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import { toast } from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ValidPassword } from '@/components/ValidPassword';

export default function LocalSafe() {
  const nav = useNavigate();
  const [isBiometricsSatus, setIsBiometricsSatus] = useState(false);
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const { accountInfo, delAccount } = useAccountStore((state) => state);

  const toChangePwd = async () => {
    if (!accountInfo.hasFeatureData) {
      toast('请先设置加密保险箱');
      return;
    }
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_CHANGE_PWD);
    }
  };
  const setupBiometrics = async (password: string) => {
    if (!window?.JsBridge) {
      toast.error('请在APP中操作');
      return;
    }
    window?.JsBridge.setupBiometrics(password, ({ code, message }: any) => {
      if (code === 0) {
        toast.success(message);
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
    <LayoutThird showBack title='本地安全策略'>
      <div className='p-4'>
        <ListRow label='修改密码' onPress={toChangePwd} />
        <ListRow
          label='生物识别'
          value={isBiometricsSatus ? '已开启' : '未开启'}
          onPress={() => setShowPasswordStatus(true)}
        />
      </div>
      <ValidPassword
        onSuccess={validPasswordSuccess}
        show={showPasswordStatus}
        onClose={() => setShowPasswordStatus(false)}
      />
    </LayoutThird>
  );
}
