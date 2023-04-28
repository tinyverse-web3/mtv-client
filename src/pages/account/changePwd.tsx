import { useState, useMemo, useRef, useEffect } from 'react';
import { Text, Checkbox, Row, Button, Input } from '@nextui-org/react';
import { STATUS_CODE, Password } from '@/lib/account/wallet';
import { toast } from 'react-hot-toast';
import { validatePassword } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store';
import { useRequest } from '@/api';
import LayoutThird from '@/layout/LayoutThird';

export default function ChangePwd() {
  const nav = useNavigate();
  const passwordManager = new Password();
  const [oldPwd, setOldPwd] = useState('');
  const [pwd, setPwd] = useState('');
  const [checked, setChecked] = useState(false);
  const [confirmPwd, setConfirmPwd] = useState('');
  const [validStatus, setValidStatus] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState(true);
  const [err, setErr] = useState(false);
  const wallet = useWalletStore((state) => state.wallet);

  const generateQuery = async () => {
    query.current.password = await passwordManager.encrypt(pwd);
  };
  const query = useRef({ password: '' });
  useEffect(() => {
    generateQuery();
  }, [pwd]);
  const { mutate: savePassword } = useRequest(
    {
      url: '/user/savepassword',
      arg: {
        method: 'post',
        auth: true,
        query: query.current,
      },
    },
    {
      onSuccess(res) {},
    },
  );

  const changePassword = async () => {
    if (oldPwd === pwd) {
      toast.error('新密码不能与旧密码相同');
      return;
    }
    if (pwd !== confirmPwd) {
      setConfirmStatus(false);
      return;
    }
    const validStatus = await validatePassword(pwd);
    if (!validStatus.value)  { 
      setValidStatus(false);
      return;
    };
    const status = await wallet?.verify(oldPwd);
    if (status === STATUS_CODE.INVALID_PASSWORD) {
      setErr(true);
    } else {
      if (checked) {
        const res = await savePassword();
        if (res.code === '000000') {
          toast.success('密码保存成功');
        } else {
          toast.error(res.msg);
          return;
        }
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
  const checkboxChange = (e: boolean) => {
    setChecked(e);
  };
  return (
    <LayoutThird showBack title='修改密码'>
      <div className='pt-6 px-6'>
        <Row className='mb-8' justify='center'>
          <Input.Password
            clearable
            bordered
            aria-label='password'
            fullWidth
            maxLength={20}
            type='password'
            value={oldPwd}
            helperColor={helper.color}
            helperText={helper.text}
            onChange={oldPwdChange}
            status={err ? 'error' : 'default'}
            placeholder='旧密码'
            initialValue=''
          />
        </Row>
        <Row className='mb-8' justify='center'>
          <Input.Password
            clearable
            bordered
            aria-label='password'
            fullWidth
            value={pwd}
            disabled={!oldPwd}
            helperColor={validStatus ? 'default' : 'error'}
            status={validStatus ? 'default' : 'error'}
            helperText='密码至少8位，包括数字、大小写字母和符号至少2种'
            onChange={(e) => setPwd(e.target.value?.trim())}
            placeholder='新密码'
          />
        </Row>
        <Row className='mb-4' justify='center'>
          <Input.Password
            clearable
            bordered
            fullWidth
            aria-label='password'
            disabled={!pwd}
            value={confirmPwd}
            helperColor={confirmStatus ? 'default' : 'error'}
            status={confirmStatus ? 'default' : 'error'}
            helperText={confirmStatus ? '' : '密码不一致'}
            onChange={(e) => setConfirmPwd(e.target.value.trim())}
            placeholder='确认密码'
            initialValue=''
          />
        </Row>
        <Checkbox
          className='mb-3'
          aria-label='checkbox'
          // isSelected={checked}
          onChange={checkboxChange}>
          <Text className='text-3'>
            是否保存本地密码到服务节点，以便忘记密码时可以通过绑定的邮箱取回本地密码？请注意，本地密码仅用于加密保存在本地的数据。
          </Text>
        </Checkbox>
        <Button
          disabled={!(pwd && oldPwd && confirmPwd)}
          className='mx-auto'
          onPress={changePassword}>
          修改
        </Button>
      </div>
    </LayoutThird>
  );
}
