import { useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useKeyPressEvent } from 'react-use';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
import { useAccountStore, useGlobalStore } from '@/store';
import { useTranslation } from 'react-i18next';

export default function Unlock() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const vault = searchParams.get('vault');
  const accountParams = searchParams.get('account');
  const { getLocalAccountInfo } = useAccountStore((state) => state);
  const { setLockStatus } = useGlobalStore((state) => state);
  const add = async () => {
    setLoading(true);
    const privateArr = [text, password, customText];
    const privateFilter = privateArr.filter((v) => !!v);
    if (privateFilter.length < 1) {
      toast.error(t('pages.account.encrypted_safe.toast.error_1'));
      setLoading(false);
      return;
    }
    if (text && text?.length < 8) {
      toast.error(t('pages.account.encrypted_safe.toast.error_2'));
      return;
    }
    if (password && password?.length < 8) {
      toast.error(t('pages.account.encrypted_safe.toast.error_3'));
      return;
    }
    if (customText && customText?.length < 8) {
      toast.error(t('pages.account.encrypted_safe.toast.error_4'));
      return;
    }
    await restore(text, password, customText);
  };
  const restore = async (
    text?: string,
    password?: string,
    customText?: string,
  ) => {
    setLoading(true);
    try {
      const { code, msg } = await account.restoreByGuardian({
        account: accountParams,
        textPrivateData: text,
        passwordPrivateData: password,
        CustomPrivateData: customText,
      });
      if (code === '000000') {
        await getLocalAccountInfo();
        setLockStatus(false);
        toast.success(t('pages.restore.toast.restore_success'));
        nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error(t('pages.restore.toast.restore_error'));
    }
    setLoading(false);
  };
  const pressHandler = async () => {
    await add();
  };
  useKeyPressEvent('Enter', () => {
    if (text) {
      pressHandler();
    }
  });
  const onChange = (e: any) => {
    setText(e);
  };
  const onPasswordChange = (e: any) => {
    setPassword(e);
  };
  const onCustomChange = (e: any) => {
    setCustomText(e);
  };
  useEffect(() => {
    console.log(vault);
    if (vault === 'false') {
      restore();
    }
  }, [vault]);
  return (
    <LayoutThird title={t('pages.restore.encrypted_safe.title')}>
      {vault !== 'false' && (
        <div className='pt-8 px-6'>
          {/* <div className='text-center mb-8'>请先恢复加密保险箱，在恢复账号</div> */}
          <Input
            clearable
            bordered
            fullWidth
            maxLength={20}
            value={text}
            className='h-50px mb-6'
            onChange={onChange}
            placeholder={t('pages.account.encrypted_safe.text')}
            initialValue=''
          />
          <Input
            clearable
            bordered
            fullWidth
            maxLength={20}
            value={password}
            className='h-50px mb-6'
            onChange={onPasswordChange}
            placeholder={t('pages.account.encrypted_safe.password')}
            initialValue=''
          />
          <Input
            clearable
            bordered
            fullWidth
            maxLength={20}
            value={customText}
            className='h-50px mb-6'
            onChange={onCustomChange}
            placeholder={t('pages.account.encrypted_safe.custom')}
            initialValue=''
          />
          <Button
            disabled={true}
            size='lg'
            loading={loading}
            className='mx-auto mb-6 w-full'
            onPress={add}>
            {t('common.fingerprint.title')}
          </Button>
          <Button
            disabled={!text && !password && !customText}
            size='lg'
            loading={loading}
            className='mx-auto w-full'
            onPress={add}>
            {t('common.confirm')}
          </Button>
        </div>
      )}
    </LayoutThird>
  );
}
