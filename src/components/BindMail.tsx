import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useWalletStore } from '@/store';
import { useRequest } from '@/api';
import { useCountDown } from '@/lib/hooks';
import toast from 'react-hot-toast';

export const BindMail = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const showLogin = useGlobalStore((state) => state.showLogin);
  const setShowLogin = useGlobalStore((state) => state.setShowLogin);
  const setMaintain = useGlobalStore((state) => state.setMaintain);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const mtvdbInfo = useGlobalStore((state) => state.mtvdbInfo);
  const setMtvdb = useGlobalStore((state) => state.setMtvdb);
  const wallet = useWalletStore((state) => state.wallet);
  const setBindStatus = useGlobalStore((state) => state.setBindStatus);
  const signMessage = useRef<any>({});
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const { start, text, flag } = useCountDown(60);
  const generateQuery = async () => {
    const { publicKey, address } = wallet || {};
    const { metadataKey, dbAddress } = mtvdbInfo || {};
    let sign;
    if (publicKey && address && metadataKey && dbAddress) {
      sign = await wallet?.sign(metadataKey);
    }
    signMessage.current = {
      publicKey: publicKey,
      address: address,
      ipns: metadataKey,
      dbAddress: mtvdbInfo?.dbAddress,
      sign,
    };
    console.log(signMessage.current);
  };
  useEffect(() => {
    generateQuery();
  }, [wallet, mtvdbInfo]);
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
        const { sssData, name, email, dbAddress, ipns } = res.data || {};
        setMaintain(!!sssData);
        setUserInfo({
          nickname: name,
          email: email,
        });
        if (dbAddress && ipns) {
          setMtvdb(dbAddress, ipns);
        }
      },
    },
  );
  const loginSucess = async (res: any) => {
    if (res.code === '000000') {
      setBindStatus(true);
      if (!signMessage.current?.sign) {
        await generateQuery();
      }
      await modifyuser();
      setLoginLoading(false);
      setShowLogin(false);
    } else {
      setLoginLoading(false);
      toast.error(res.msg);
    }
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
          绑定邮箱
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
