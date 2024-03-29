import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import { useAccountStore, useRestoreStore } from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutThird from '@/layout/LayoutThird';
import { toast } from 'react-hot-toast';
import { ROUTE_PATH } from '@/router';
import { hideHalfString } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function PrivateData() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [textPlaceholder, setTextPlaceholder] = useState(
    t('pages.account.encrypted_safe.text'),
  );
  const [passwordPlaceholder, setPasswordPlaceholder] = useState(
    t('pages.account.encrypted_safe.password'),
  );
  const [customPlaceholder, setCustomPlaceholder] = useState(
    t('pages.account.encrypted_safe.custom'),
  );
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const { accountInfo } = useAccountStore((state) => state);
  const { setTextPrivateData, setPasswordPrivateData, setCustomPrivateData } =
    useRestoreStore((state) => state);

  const add = async () => {
    const privateArr = [text, password, customText];
    const privateFilter = privateArr.filter((v) => !!v);
    if (privateFilter.length < 2) {
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
    setTextPrivateData(text);
    setPasswordPrivateData(password);
    setCustomPrivateData(customText);
    nav(ROUTE_PATH.ACCOUNT_PRIVATEDATA_VERIFY);
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
    if (accountInfo.textPrivateData) {
      setTextPlaceholder(hideHalfString(accountInfo.textPrivateData));
    }
    if (accountInfo.passwordPrivateData) {
      setPasswordPlaceholder(hideHalfString(accountInfo.passwordPrivateData));
    }
    if (accountInfo.customPrivateData) {
      setCustomPlaceholder(hideHalfString(accountInfo.customPrivateData));
    }
  }, [
    accountInfo.textPrivateData,
    accountInfo.textPrivateData,
    accountInfo.textPrivateData,
  ]);
  return (
    <LayoutThird title={t('pages.account.encrypted_safe.set_text')}>
      <div className='p-4'>
        <div className='mb-8 text-xs'>
          {t('pages.account.encrypted_safe.hint')}
        </div>
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          value={text}
          className='h-50px mb-6'
          onChange={onChange}
          placeholder={textPlaceholder}
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
          placeholder={passwordPlaceholder}
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
          placeholder={customPlaceholder}
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
          {t('common.next_step')}
        </Button>
      </div>
    </LayoutThird>
  );
}
