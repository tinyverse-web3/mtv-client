import { useState, useEffect } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import { toast } from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ValidPassword } from '@/components/ValidPassword';

export default function MultiVerify() {
  const nav = useNavigate();
  const [type, setType] = useState(0);
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const { accountInfo, delAccount } = useAccountStore((state) => state);

  const toPrivateData = async () => {
    nav(ROUTE_PATH.ACCOUNT_PRIVATEDATA);
  };
  const toProtector = async () => {
    if (!accountInfo.hasFeatureData) {
      toast('请先设置加密保险箱');
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
    <LayoutThird showBack title='多因素验证'>
      <div className='p-4'>
        <ListRow label='加密保险箱' onPress={() => showVerifyPassword(1)} />
        <ListRow label='守护者' onPress={() => showVerifyPassword(2)} />
      </div>
      <ValidPassword
        onSuccess={validPasswordSuccess}
        show={showPasswordStatus}
        onClose={() => setShowPasswordStatus(false)}
      />
    </LayoutThird>
  );
}
