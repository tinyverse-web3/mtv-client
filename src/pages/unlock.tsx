import { useState, useMemo } from 'react';
import { Text, Row, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { Password } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import {
  useWalletStore,
  useMtvdbStore,
  useGlobalStore,
  useNostrStore,
} from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutOne from '@/layout/LayoutOne';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { ROUTE_PATH } from '@/router';

export default function Unlock() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const setWallet = useWalletStore((state) => state.setWallet);
  const resetWallet = useWalletStore((state) => state.reset);
  const initMtvdb = useMtvdbStore((state) => state.init);
  const mtvdbInfo = useGlobalStore((state) => state.mtvdbInfo);
  const resetGlobal = useGlobalStore((state) => state.reset);
  const resetNostr = useNostrStore((state) => state.reset);
  const unlock = async () => {
    setLoading(true);
    const status = await wallet?.verify(pwd);
    if (status === STATUS_CODE.INVALID_PASSWORD) {
      setErr(true);
    } else {
      setWallet(wallet);
      const { publicKey, privateKey } = wallet || {};
      if (privateKey) {
        const { dbAddress, metadataKey } = mtvdbInfo;
        if (dbAddress && metadataKey) {
          await initMtvdb(privateKey, dbAddress, metadataKey);
        }
      }
      setLoading(false);
      nav(-1);
    }
  };
  const pressHandler = async () => {
    await unlock();
  };
  useKeyPressEvent('Enter', () => {
    if (pwd) {
      pressHandler();
    }
  });

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
    setPwd(e.target.value?.trim());
  };
  const deleteUser = async (e: any) => {
    await Promise.all([
      resetNostr(),
      resetWallet(),
      resetGlobal(),
      wallet?.delete(),
    ]);
    nav('/', { replace: true });
  };
  const toRetrieve = () => {
    nav(ROUTE_PATH.RETRIEVE);
  };
  return (
    <LayoutOne className='px-6'>
      <HeaderLogo />
      {/* <Text h4 className='mb-9 text-center text-6'>
        解锁
      </Text> */}
      <Row className='mb-6 pt-8' justify='center'>
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
          status={err ? 'error' : 'default'}
          placeholder='输入密码'
          initialValue=''
        />
      </Row>
      <Button
        disabled={!pwd}
        size='lg'
        loading={loading}
        className='mx-auto mb-2 w-full'
        onPress={unlock}>
        解锁
      </Button>
      <Button
        light
        color='error'
        auto
        className='text-12px mx-auto'
        onPress={deleteUser}>
        忘记密码，恢复账号或重新创建
      </Button>
      <div className='flex justify-end'>
        <Button
          light
          auto
          color='success'
          className='text-14px px-0'
          onPress={toRetrieve}>
          忘记密码
        </Button>
      </div>
    </LayoutOne>
  );
}
