import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useWalletStore } from '@/store';
import { useRequest } from '@/api';
import { useCountDown } from '@/lib/hooks';
import toast from 'react-hot-toast';

export const BindMail = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const { showLogin, setShowLogin, setUserInfo, setBindStatus, setUserLevel } =
    useGlobalStore((state) => state);
  const wallet = useWalletStore((state) => state.wallet);
  const signMessage = useRef<any>({});
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const { start, text, flag, reset } = useCountDown(60);
  const generateQuery = async () => {
    const { publicKey, address } = wallet || {};
    let sign;
    const ipns = '';
    if (publicKey && address && ipns) {
      sign = await wallet?.sign(ipns);
    }
    signMessage.current = {
      publicKey: publicKey,
      address: address,
      ipns,
      sign,
    };
  };
  useEffect(() => {
    // generateQuery();
  }, [wallet]);
  const { mutate: modifyuser } = useRequest(
    {
      url: '/user/modifyuser',
      arg: {
        method: 'post',
        auth: true,
        query: signMessage.current,
      },
    },
    {
      onSuccess() {
        getuserinfo();
      },
    },
  );
  const { mutate: getuserinfo } = useRequest(
    {
      url: '/user/getuserinfo',
      arg: { method: 'get', auth: true },
    },
    {
      onSuccess: (res) => {
        const { name, email, dbAddress, ipns, safeLevel } = res.data || {};
        setUserLevel(safeLevel);
        setUserInfo({
          nickname: name,
          email: email,
        });
      },
    },
  );
  const loginSucess = async (res: any) => {
    if (res.code === '000000') {
      setBindStatus(true);
      if (!signMessage.current?.sign) {
        await generateQuery();
      }
      setLoginLoading(false);
      await modifyuser();
    } else {
      toast.error(res.msg);
    }
    setShowLogin(false);
    reset();
  };
  const { mutate } = useRequest(
    {
      url: '/user/bindmail',
      arg: {
        auth: true,
        method: 'post',
        query: { email, confirmCode: verifyCode },
      },
    },
    {
      onSuccess: loginSucess,
      onError() {
        setLoginLoading(false);
      },
    },
  );

  const { mutate: sendCode, loading: codeLoading } = useRequest(
    {
      url: '/user/sendmail4verifycode',
      arg: {
        method: 'post',
        query: { email },
      },
    },
    {
      onSuccess(res) {
        if (res.code === '000000') {
          toast.success('验证码已发送');
          start();
        } else {
          toast.error(res.msg);
        }
      },
    },
  );

  const closeHandler = () => {
    setShowLogin(false);
  };
  const loginHandler = async () => {
    if (!verifyCode) {
      console.log('没有验证码');
      return;
    }

    setLoginLoading(true);
    await mutate();
  };
  const emailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const verifyCodeChange = (e: any) => {
    setVerifyCode(e.target.value);
  };
  const sendVerify = async () => {
    if (email && flag) {
      await sendCode();
    }
  };
  const emailBlur = () => {};
  return (
    <Modal
      className='max-w-90% mx-auto'
      blur
      autoMargin
      closeButton
      open={showLogin}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          绑定邮箱
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          clearable
          bordered
          fullWidth
          type='email'
          className='h-50px'
          aria-label='email'
          color='primary'
          size='lg'
          onBlur={emailBlur}
          value={email}
          onChange={emailChange}
          placeholder='邮箱'
          contentLeft={<div className='i-mdi-email color-current' />}
        />
        <div className='flex'>
          <Input
            clearable
            bordered
            fullWidth
            type='number'
            maxLength={6}
            aria-label='验证码'
            className='flex-1 50px'
            color='primary'
            size='lg'
            value={verifyCode}
            onChange={verifyCodeChange}
            placeholder='验证码'
            contentLeft={<div className='i-mdi-shield-outline color-current' />}
          />
          <Button
            auto
            className='ml-4 min-w-20'
            color='secondary'
            loading={codeLoading}
            onPress={sendVerify}>
            {text}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color='error' onPress={closeHandler}>
          关闭
        </Button>
        <Button auto onPress={loginHandler} loading={loginLoading}>
          绑定邮箱
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export async function useCheckLogin() {
  const bindStatus = useGlobalStore.getState().bindStatus;
  let loginStatus = bindStatus;
  const setShowLogin = useGlobalStore.getState().setShowLogin;
  if (!loginStatus) {
    setShowLogin(true);
    loginStatus = await new Promise((resolve, reject) => {
      useGlobalStore.subscribe((state) => {
        if (state.bindStatus) {
          resolve(state.bindStatus);
        }
      });
    });
  }
  return loginStatus;
}
