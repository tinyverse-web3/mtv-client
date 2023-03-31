import { useState, useMemo } from 'react';
import { Text, Row, Button, Input } from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import {
  useWalletStore,
  useMtvdbStore,
  useGlobalStore,
  useNostrStore,
} from '@/store';
import Page from '@/layout/LayoutTwo';

export default function ChangePwd() {
  const nav = useNavigate();
  const [oldPwd, setOldPwd] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [validStatus, setValidStatus] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState(true);
  const [err, setErr] = useState(false);
  const wallet = useWalletStore((state) => state.wallet);
  const changePassword = async () => {
    const status = await wallet?.verify(oldPwd);
    if (status === STATUS_CODE.INVALID_PASSWORD) {
      setErr(true);
    } else {
      if (pwd !== confirmPwd) {
        setConfirmStatus(false);
        return;
      }
      await wallet?.changePwd(oldPwd, pwd);
      nav(-1);
    }
  };
  const helper = useMemo<{ text: string; color: 'default' | 'error' }>(() => {
    if (!err)
      return {
        text: '默认密码：123456',
        color: 'default',
      };
    return {
      text: '旧密码错误',
      color: 'error',
    };
  }, [err]);
  const oldPwdChange = (e: any) => {
    setErr(false);
    setOldPwd(e.target.value?.trim());
  };
  return (
    <Page showBack title='修改密码'>
      <div className='pt-6'>
        <Row className='mb-12' justify='center'>
          <Input.Password
            clearable
            bordered
            fullWidth
            maxLength={20}
            type='password'
            value={oldPwd}
            helperColor={helper.color}
            helperText={helper.text}
            onChange={oldPwdChange}
            rounded
            status={err ? 'error' : 'default'}
            labelPlaceholder='旧密码'
            initialValue=''
          />
        </Row>
        <Row className='mb-12' justify='center'>
          <Input.Password
            clearable
            bordered
            fullWidth
            rounded
            value={pwd}
            disabled={!oldPwd}
            helperColor={validStatus ? 'default' : 'error'}
            status={validStatus ? 'default' : 'error'}
            // helperText='8-16位，包含大小写和数字'
            onChange={(e) => setPwd(e.target.value?.trim())}
            labelPlaceholder='新密码'
          />
        </Row>
        <Row className='mb-8' justify='center'>
          <Input.Password
            clearable
            bordered
            fullWidth
            rounded
            disabled={!pwd}
            value={confirmPwd}
            helperColor={confirmStatus ? 'default' : 'error'}
            status={confirmStatus ? 'default' : 'error'}
            helperText={confirmStatus ? '' : '密码不一致'}
            onChange={(e) => setConfirmPwd(e.target.value.trim())}
            labelPlaceholder='重复密码'
            initialValue=''
          />
        </Row>
        <Button
          disabled={!(pwd && oldPwd && confirmPwd)}
          className='mx-auto'
          onPress={changePassword}>
          修改
        </Button>
      </div>
    </Page>
  );
}
