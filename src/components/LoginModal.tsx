import { useState, useMemo } from 'react';
import { Modal, Text, Card, Row, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useWalletStore } from '@/store';
import { validEmail } from '@/lib/utils';
import { useRequest } from '@/api';
import { useCountDown } from '@/lib/hooks';
import { signMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

export const LoginModal = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const showLogin = useGlobalStore((state) => state.showLogin);
  const setShowLogin = useGlobalStore((state) => state.setShowLogin);
  const setMaintain = useGlobalStore((state) => state.setMaintain);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const mtvdbInfo = useGlobalStore((state) => state.mtvdbInfo);
  const setMtvdb = useGlobalStore((state) => state.setMtvdb);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const wallet = useWalletStore((state) => state.wallet);
  const setToken = useGlobalStore((state) => state.setToken);
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const { start, text, flag } = useCountDown(60);
  const query = useMemo(() => {
    const { publicKey, privateKey, address } = wallet?.wallet || {};
    const { metadataKey, dbAddress } = mtvdbInfo || {};
    let sign;
    if (publicKey && privateKey && address && metadataKey && dbAddress) {
      sign = signMessage(metadataKey, { address, privateKey });
    }
    return {
      publicKey: wallet?.wallet?.publicKey,
      address: wallet?.wallet?.address,
      ipns: metadataKey,
      dbAddress: mtvdbInfo?.dbAddress,
      sign,
    };
  }, [wallet, userInfo]);
  const { mutate: modifyuser } = useRequest(
    {
      url: '/user/modifyuser',
      arg: {
        method: 'post',
        auth: true,
        query,
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
        setUserInfo({
          nickname: res.data.name,
          email: res.data.email,
        });
        setMtvdb(res.data.dbAddress, res.data.ipns)
      },
    },
  );
  const loginSucess = async (res: any) => {
    if (res.data) {
      await setToken(res.data);
      if (wallet?.wallet?.publicKey) {
        await modifyuser();
      }
      setLoginLoading(false);
      setShowLogin(false);
    }
  };
  const loginQuery = useMemo(() => {}, [verifyCode, wallet]);
  const { mutate } = useRequest(
    {
      url: '/user/login',
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

  const { mutate: sendCode, loading: codeLoading } = useRequest({
    url: '/user/sendmail',
    arg: {
      method: 'post',
      query: { email },
    },
  });

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
      toast.success('验证码已发送');
      await start();
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
          获取Token
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          clearable
          bordered
          fullWidth
          type='email'
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
            className='flex-1'
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
          获取Token
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export async function useCheckLogin() {
  const isLogin = useGlobalStore.getState().isLogin;
  let loginStatus = isLogin;
  const setShowLogin = useGlobalStore.getState().setShowLogin;
  if (!loginStatus) {
    setShowLogin(true);
    loginStatus = await new Promise((resolve, reject) => {
      useGlobalStore.subscribe((state) => {
        if (state.isLogin) {
          resolve(state.isLogin);
        }
      });
    });
  }
  return loginStatus;
}
