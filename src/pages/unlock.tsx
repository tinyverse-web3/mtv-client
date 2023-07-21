import { useState, useMemo } from 'react';
import { Row, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccountStore, useGlobalStore } from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutOne from '@/layout/LayoutOne';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';

export default function Unlock() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const { getLocalAccountInfo, delAccount } = useAccountStore((state) => state);
  const { reset: resetGlobal, setLockStatus } = useGlobalStore((state) => state);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const unlock = async () => {
    setLoading(true);
    const result = await account.unlock(pwd);
    if (result) {
      await getLocalAccountInfo()
      if (redirect) {
        location.replace(decodeURIComponent(redirect));
        return;
      }
      nav(ROUTE_PATH.SPACE_INDEX);
    } else {
      setErr(true);
    }
    setLockStatus(false);
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
    await Promise.all([resetGlobal(), delAccount()]);
    localStorage.clear();
    nav(ROUTE_PATH.INDEX, { replace: true });
  };
  const toRetrieve = () => {

    nav(ROUTE_PATH.RETRIEVE);
  };
  return (
    <LayoutOne className='px-6 pt-14'>
      <HeaderLogo />
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
