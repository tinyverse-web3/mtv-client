import { useState, useMemo } from 'react';
import { Text, Row, Button, Input } from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/wallet';
import { useNavigate } from 'react-router-dom';
import {
  useWalletStore,
  useMtvdbStore,
  useGlobalStore,
  useNostrStore,
} from '@/store';
import Page from '@/layout/page';

export default function Unlock() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);
  const setWallet = useWalletStore((state) => state.setWallet);
  const resetWallet = useWalletStore((state) => state.reset);
  const initMtvdb = useMtvdbStore((state) => state.init);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const resetGlobal = useGlobalStore((state) => state.reset);
  const resetNostr = useNostrStore((state) => state.reset);
  const unlock = async () => {
    const status = await wallet?.verify(pwd);
    if (status === STATUS_CODE.INVALID_PASSWORD) {
      setErr(true);
    } else {
      setWallet(wallet);
      const { privateKey } = wallet.wallet || {};
      if (privateKey) {
        const { dbAddress } = userInfo?.mtvdb || {};
        if (dbAddress) {
          await initMtvdb(privateKey, dbAddress);
        }
      }
      nav('/home', { replace: true });
    }
  };
  const helper = useMemo<{ text: string; color: 'default' | 'error' }>(() => {
    if (!err)
      return {
        text: '',
        color: 'default',
      };
    return {
      text: '密码错误',
      color: 'error',
    };
  }, [err]);
  const pwdChange = (e: any) => {
    setErr(false);
    setPwd(e.target.value);
  };
  const deleteUser = async (e: any) => {
    await Promise.all([resetNostr(), resetWallet(), resetGlobal(), wallet?.deleteKeystore()]);
    nav('/restore', { replace: true });
  };
  return (
    <Page showBack={false}>
      <Text h4 className='mb-9 text-center text-6'>
        解锁
      </Text>
      <Row className='mb-8' justify='center'>
        <Input.Password
          clearable
          bordered
          fullWidth
          maxLength={20}
          type='password'
          value={pwd}
          helperColor={helper.color}
          helperText={helper.text}
          onChange={pwdChange}
          rounded
          status={err ? 'error' : 'default'}
          labelPlaceholder='passowrd'
          initialValue=''
        />
      </Row>
      <Button className='mx-auto mb-4' onPress={unlock}>
        解锁
      </Button>
      <Button
        light
        color='error'
        auto
        className='text-12px mx-auto'
        onPress={deleteUser}>
        忘记密码，恢复账号
      </Button>
    </Page>
  );
}
