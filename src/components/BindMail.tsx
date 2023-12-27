import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/form/Input';
import { Icon } from '@iconify/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCountDown } from '@/lib/hooks';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { OauthThird } from '@/components/OauthThird';
import { useNavigate } from 'react-router-dom';

export const BindMail = () => {
  const nav = useNavigate();
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
    setEmail(e);
    reset();
  };
  const oauthGoogle = async (data: any) => {
    const { code, msg } = await account.oauthGoogle(data);
    console.log(code);
    if (code === '000000') {
      await getLocalAccountInfo();
      toast.success(t('common.toast.bind_success'));
      closeHandler();
    } else {
      toast.error(msg || t('common.toast.bind_error'));
    }
  };
  const verifyByTelegram = async (user: any) => {
    // const testData = {
    //   id: 5536129150,
    //   first_name: '子曰',
    //   username: 'Web3Follow',
    //   photo_url:
    //     'https://t.me/i/userpic/320/rZKOa2AjixP36NGHGFD9HEJBYyfehf-aLMrF7NL1INfMTQvWXCteIQJw158PFMR2.jpg',
    //   auth_date: 1702025683,
    //   hash: '0d694da3df3b10d7ee6d9d65bee7ff288b4cb21c0212c735125449b0163ec43c',
    // };
    const { code, msg } = await account.oauthTelegram({
      Id: user.id,
      Params: JSON.stringify(user),
    });
    if (code === '000000') {
      await getLocalAccountInfo();
      toast.success(t('common.toast.bind_success'));
      closeHandler();
      nav(-2)
    } else {
      toast.error(msg || t('common.toast.bind_error'));
    }
    
  };
  const verifyCodeChange = (e: any) => {
    setVerifyCode(e);
  };
  const sendVerify = async () => {
    console.log(email);
    console.log(flag);
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
      closeButton
      size='xs'
      classNames={{
        wrapper: 'items-center',
      }}
      isDismissable={false}
      isOpen={showLogin}
      onClose={closeHandler}>
      <ModalContent>
        <ModalHeader>
          <div className='text-18px'>{t('common.bind_email')}</div>
        </ModalHeader>
        <ModalBody>
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
            placeholder={t('common.email')}
            contentLeft={<Icon icon='mdi:email' className='color-current' />}
          />
          <div className='flex items-center'>
            <Input
              clearable
              bordered
              fullWidth
              type='number'
              maxLength={6}
              aria-label={t('common.code')}
              className='flex-1'
              color='primary'
              size='lg'
              value={verifyCode}
              onChange={verifyCodeChange}
              placeholder={t('common.code')}
              contentLeft={
                <Icon icon='mdi:shield-outline' className=' color-current' />
              }
            />
            <Button
              className='ml-4 min-w-20 h-full text-xs'
              color='purple'
              onPress={sendVerify}>
              {text}
            </Button>
          </div>
          <OauthThird
            onGoogleChange={oauthGoogle}
            onTelegramChange={verifyByTelegram}
          />
        </ModalBody>
        <ModalFooter>
          <Button color='red' variant='ghost' size='sm' onPress={closeHandler}>
            {t('common.cancel')}
          </Button>
          <Button
            onPress={loginHandler}
            className='ml-6'
            size='sm'
            disabled={!email || !verifyCode}
            loading={loginLoading}>
            {t('common.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
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
