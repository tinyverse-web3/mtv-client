import { useState, useMemo } from 'react';
import { Text, Row, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { Password } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import {
  useWalletStore,
  useMtvStorageStore,
  useGlobalStore,
  useNostrStore,
} from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutOne from '@/layout/LayoutOne';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { ROUTE_HASH_PATH, ROUTE_PATH } from '@/router';

export default function Unlock() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const setWallet = useWalletStore((state) => state.setWallet);
  const resetWallet = useWalletStore((state) => state.reset);
  const {
    init: initMtvStorage,
    destory: destoryStorage,
  } = useMtvStorageStore((state) => state);
  const resetGlobal = useGlobalStore((state) => state.reset);
  const resetNostr = useNostrStore((state) => state.reset);
  const unlock = async () => {
    setLoading(true);
    const status = await wallet?.verify(pwd);
    console.log(status);
    if (status === STATUS_CODE.INVALID_PASSWORD) {
      setErr(true);
    } else {
      setWallet(wallet);
      const { publicKey, privateKey } = wallet || {};
      if (privateKey) {
        await initMtvStorage(privateKey);
      }
      nav(ROUTE_PATH.SPACE_INDEX);
    }
    setLoading(false);
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
      destoryStorage(),
      wallet?.delete(),
    ]);
    nav(ROUTE_PATH.INDEX, { replace: true });
  };
  const toRetrieve = () => {
    nav(ROUTE_PATH.RETRIEVE);
  };
  return (
    <LayoutOne className='px-6 pt-14'>
      <HeaderLogo />
      {/* <Text h4 className='mb-9 text-center text-6'>
        解锁
      </Text> */}
      <Row className='mb-6 pt-8' justify='center'>
        <Input.Password
          clearable
          bordered
          aria-label='password'
          fullWidth
          maxLength={20}
          type='password'
          value={pwd}
          className='h-50px'
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
          className='text-14px px-0 text-blue-5'
          onPress={toRetrieve}>
          忘记密码
        </Button>
      </div>
    </LayoutOne>
  );
}
