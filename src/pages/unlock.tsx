import { useState, useMemo } from 'react';
import { Text, Row, Button, Input } from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/wallet';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store';
import Page from '@/layout/page';

export default function Unlock() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);
  const setWallet = useWalletStore((state) => state.setWallet);
  const unlock = async () => {
    const status = await wallet?.verify(pwd);
    if (status === STATUS_CODE.INVALID_PASSWORD) {
      setErr(true);
    } else {
      setWallet(wallet);
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
  return (
    <Page showBack={false}>
      <Text h4 className='mb-9 text-center text-6'>
        解锁
      </Text>
      <Row className='mb-8' justify='center'>
        <Input
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
      <Button className='mx-auto mt-4' onPress={unlock}>
        unlock
      </Button>
    </Page>
  );
}
