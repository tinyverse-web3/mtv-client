import { useState, useMemo } from 'react';
import { Row, Input, Image } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useGlobalStore,
  useAccountStore,
  useChatStore,
  useNoteStore,
  useGunStore,
  usePasswordStore,
  useRestoreStore,
  useQuestionStore,
} from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutOne from '@/layout/LayoutOne';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
export default function Unlock() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const { getLocalAccountInfo, delAccount, accountInfo } = useAccountStore((state) => state);
  const { reset: resetChat } = useChatStore((state) => state);
  const { reset: resetNote } = useNoteStore((state) => state);
  const { reset: resetGun } = useGunStore((state) => state);
  const { reset: resetpassword } = usePasswordStore((state) => state);
  const { reset: resetRestore } = useRestoreStore((state) => state);
  const { reset: resetQuestion } = useQuestionStore((state) => state);
  const { reset: resetGlobal, setLockStatus } = useGlobalStore(
    (state) => state,
  );
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const unlock = async (password: string) => {
    setLoading(true);
    const result = await account.unlock(password);
    console.log(result);
    if (result) {
      await getLocalAccountInfo();
      if (redirect) {
        console.log(redirect);
        location.replace(decodeURIComponent(redirect));
        return;
      }
      nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
    } else {
      setErr(true);
    }
    setLockStatus(false);
    setLoading(false);
  };
  const pressHandler = async () => {
    await unlock(pwd);
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
      text: t('common.password.error'),
      color: 'error',
    };
  }, [err]);
  const pwdChange = (e: any) => {
    setErr(false);
    setPwd(e.target.value?.trim());
  };
  const deleteUser = async (e: any) => {
    await Promise.all([
      resetGlobal(),
      delAccount(),
      resetChat(),
      resetNote(),
      resetGun(),
      resetpassword(),
      resetRestore(),
      resetQuestion(),
    ]);
    localStorage.clear();
    nav(ROUTE_PATH.INDEX, { replace: true });
  };
  const toRetrieve = () => {
    nav(ROUTE_PATH.RETRIEVE);
  };
  const startBiometric = async () => {
    window?.JsBridge.startBiometric(({ code, message, data }: any) => {
      if (code === 0) {
        toast.success(t('pages.unlock.success'));
        unlock(data);
      } else {
        toast.error(message);
      }
    });
  };
  return (
    <LayoutOne className='relative'>
      <div className='px-6 pt-14 h-full '>
        <HeaderLogo />
        {/* <div className='flex justify-center'>
          <Button
            light
            color='error'
            auto
            className='text-12px mx-auto'
            onPress={deleteUser}>
            恢复账号或重新创建
          </Button>
        </div> */}
        <Row className='mb-8 pt-8' justify='center'>
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
            placeholder={t('common.password.input')}
            initialValue=''
          />
        </Row>
        <Button
          disabled={!pwd}
          size='lg'
          loading={loading}
          className='mx-auto mb-6 w-full'
          onClick={pressHandler}>
          {t('pages.unlock.btn_unlock')}
        </Button>

        <div className='flex justify-end mb-26'>
          <Button
            light
            auto
            color='success'
            className='text-14px px-0 text-blue-5'
            onClick={deleteUser}>
            {t('pages.unlock.forget_password')}
          </Button>
        </div>
        <Image
          onClick={startBiometric}
          src='/figer.png'
          className='w-10 h-10 cursor-pointer'
        />
      </div>
    </LayoutOne>
  );
}
