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
  const [textPlaceholder, setTextPlaceholder] =
    useState(t('pages.account.encrypted_safe.text_placeholder'));
  const [passwordPlaceholder, setPasswordPlaceholder] = useState(t('pages.account.encrypted_safe.password_placeholder'));
  const [customPlaceholder, setCustomPlaceholder] = useState(t('pages.account.encrypted_safe.custom_placeholder'));
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const { accountInfo } = useAccountStore((state) => state);
  const { setTextPrivateData, setPasswordPrivateData } = useRestoreStore(
    (state) => state,
  );

  const add = async () => {
    const privateArr = [text, password, customText];
    const privateFilter = privateArr.filter((v) => !!v);
    if (privateFilter.length < 2) {
      toast.error('请至少输入两种内容');
      setLoading(false);
      return;
    }
    if (text?.length >= 12) {
      toast.error('最多输入三种内容');
      return;
    }
    setTextPrivateData(text);
    setPasswordPrivateData(password);
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
    setText(e.trim());
  };
  const onPasswordChange = (e: any) => {
    setPassword(e.trim());
  };
  const onCustomChange = (e: any) => {
    setCustomText(e.trim());
  };
  useEffect(() => {
    if (accountInfo.textPrivateData) {
      setTextPlaceholder(hideHalfString(accountInfo.textPrivateData));
    }
    if (accountInfo.passwordPrivateData) {
      setPasswordPlaceholder(hideHalfString(accountInfo.passwordPrivateData));
    }
  }, [accountInfo.textPrivateData, accountInfo.textPrivateData]);
  return (
    <LayoutThird title={t('pages.account.encrypted_safe.set_text')}>
      <div className='pt-8 px-6'>
        <div className='mb-8 text-3'>
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
