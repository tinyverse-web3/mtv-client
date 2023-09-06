import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCountDown } from '@/lib/hooks';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const BindMail = () => {
  const { t } = useTranslation();
  const [loginLoading, setLoginLoading] = useState(false);
  const { showLogin, setShowLogin } = useGlobalStore((state) => state);
  const { setAccountInfo, getLocalAccountInfo } = useAccountStore(
    (state) => state,
  );
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const { start, text, flag, reset } = useCountDown(60);
  const closeHandler = () => {
    reset();
    setEmail('');
    setVerifyCode('');
    setShowLogin(false);
    setLoginLoading(false);
    document.body.removeAttribute('style');
  };
  const loginHandler = async () => {
    if (!verifyCode) {
      console.log('没有验证码');
      return;
    }

    setLoginLoading(true);
    const { code, msg } = await account.addGuardian({
      account: email,
      verifyCode: verifyCode,
      type: 'email',
    });
    if (code === '000000') {
      setAccountInfo({ bindStatus: true });
      await getLocalAccountInfo();

      closeHandler();
      toast.success(t('common.toast.bind_success'));
    } else {
      reset();
      toast.error(msg || t('common.toast.bind_error'));
    }
    setLoginLoading(false);
  };
  const emailChange = (e: any) => {
    setEmail(e.target.value);
    reset();
  };
  const verifyCodeChange = (e: any) => {
    setVerifyCode(e.target.value);
  };
  const sendVerify = async () => {
    console.log(email )
    console.log(flag )
    if (email && flag) {
      const { code, msg } = await account.sendVerifyCode({
        type: 'email',
        account: email,
      });
      if (code === '000000') {
        toast.success(t('common.code_sended'));
        start();
      } else {
        
        toast.error(msg);
      }
    }
  };
  const emailBlur = () => {};
  return (
    <Modal
      className='max-w-90% mx-auto'
      autoMargin
      closeButton
      open={showLogin}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          {t('common.bind_email')}
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
          placeholder={t('common.email')}
          contentLeft={<div className='i-mdi-email color-current' />}
        />
        <div className='flex'>
          <Input
            clearable
            bordered
            fullWidth
            type='number'
            maxLength={6}
            aria-label={t('common.code')}
            className='flex-1 50px'
            color='primary'
            size='lg'
            value={verifyCode}
            onChange={verifyCodeChange}
            placeholder={t('common.code')}
            contentLeft={<div className='i-mdi-shield-outline color-current' />}
          />
          <Button
            auto
            className='ml-4 min-w-20'
            color='secondary'
            onPress={sendVerify}>
            {text}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color='error' onPress={closeHandler}>
          {t('common.cancel')}
        </Button>
        <Button
          auto
          onPress={loginHandler}
          className="ml-6"
          disabled={!email || !verifyCode}
          loading={loginLoading}>
          {t('common.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export async function useCheckLogin() {
  const { bindStatus } = useAccountStore.getState().accountInfo;
  console.log(useAccountStore.getState().accountInfo);
  let loginStatus = bindStatus;
  const setShowLogin = useGlobalStore.getState().setShowLogin;
  if (!loginStatus) {
    setShowLogin(true);
    loginStatus = await new Promise((resolve, reject) => {
      useAccountStore.subscribe((state) => {
        if (state.accountInfo.bindStatus) {
          resolve(state.accountInfo.bindStatus);
        }
      });
    });
  }
  return loginStatus;
}
