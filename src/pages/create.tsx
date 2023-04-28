import { useState } from 'react';
import { Row, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { validatePassword } from '@/lib/utils';
import { useWalletStore, useGlobalStore, useMtvStorageStore } from '@/store';

import Page from '@/layout/LayoutTwo';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
export default function About() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const setWallet = useWalletStore((state) => state.setWallet);
  const initMtvStorage = useMtvStorageStore((state) => state.init);
  const [confirmPwd, setPwdChange] = useState('');
  const [validStatus, setValidStatus] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState(true);
  const create = async () => {
    const valid = await validatePassword(pwd);
    setValidStatus(valid as boolean);
    if (!pwd || !confirmPwd || !valid) return;
    if (pwd !== confirmPwd) {
      setConfirmStatus(false);
      return;
    }
    setLoading(true);
    await wallet.create(pwd);
    const { privateKey } = wallet || {};
    if (privateKey) {
      console.time('db')
      await initMtvStorage(privateKey);
    }
    setWallet(wallet);
    setLoading(false);
    nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
  };
  const pwdChange = (e: any) => {
    setPwd(e.target.value);
  };
  const confirmPwdChange = (e: any) => {
    setPwdChange(e.target.value);
  };
  return (
    <Page showBack={false} title='创建账号'>
      <Row className='mb-12 mt-10' justify='center'>
        <Input.Password
          clearable
          bordered
          fullWidth
          value={pwd}
          helperColor={validStatus ? 'default' : 'error'}
          status={validStatus ? 'default' : 'error'}
          // helperText='8-16位，包含大小写和数字'
          onChange={pwdChange}
          labelPlaceholder='密码'
        />
      </Row>
      <Row className='mb-8' justify='center'>
        <Input.Password
          clearable
          bordered
          fullWidth
          value={confirmPwd}
          helperColor={confirmStatus ? 'default' : 'error'}
          status={confirmStatus ? 'default' : 'error'}
          helperText={confirmStatus ? '' : '密码不一致'}
          onChange={confirmPwdChange}
          labelPlaceholder='重复密码'
          initialValue=''
        />
      </Row>
      <Button
        disabled={!(confirmPwd && pwd)}
        loading={loading}
        className='mx-auto mt-4'
        onPress={create}>
        创建
      </Button>
    </Page>
  );
}
