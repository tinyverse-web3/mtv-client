import { useState, useMemo } from 'react';
import { Image } from '@nextui-org/react';
import { Password } from '@/components/form/Password';
import { Button } from '@/components/form/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccountStore, useGlobalStore } from '@/store';
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
  const { getLocalAccountInfo, delAccount, accountInfo } = useAccountStore(
    (state) => state,
  );
  const { setLockStatus } = useGlobalStore((state) => state);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const unlock = async (password: string) => {
    setLoading(true);
    const result = await account.unlock(password);
    console.log(result);
    if (result.code === '000000') {
      await getLocalAccountInfo();
      if (redirect) {
        location.replace(decodeURIComponent(redirect));
        return;
      }
      nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
    } else {
      setErr(true);
      toast.error(result.msg);
    }
    setLockStatus(false);
    setLoading(false);
  };
  const deleteUser = async (e: any) => {
    nav(ROUTE_PATH.INDEX, { replace: true });
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
    setPwd(e);
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
        <div className='mb-8 pt-8'>
          <Password
            maxLength={20}
            value={pwd}
            size="lg"
            className='h-50px'
            helperColor={helper.color}
            helperText={helper.text}
            onChange={pwdChange}
            status={err ? 'error' : 'default'}
            placeholder={t('common.password.input')}
            initialValue=''
          />
        </div>
        <Button
          disabled={!pwd}
          loading={loading}
          fullWidth
          size="lg"
          className=' mb-6 '
          onClick={pressHandler}>
          {t('pages.unlock.btn_unlock')}
        </Button>

        <div className='flex justify-end mb-24'>
          <Button
            variant='ghost'
            size='sm'
            className='p-0'
            onClick={deleteUser}>
            {t('pages.unlock.forget_password')}
          </Button>
        </div>
        <div className='flex justify-center'>
          <Image
            onClick={startBiometric}
            src='/figer.png'
            className='w-10 h-10 mx-auto'
          />
        </div>
      </div>
      <div className='text-3 text-center mt-20'>
        测试数据库已于2023年6月16日清除，旧账号无法通过守护者和智能隐私恢复。
      </div>
    </LayoutOne>
  );
}
