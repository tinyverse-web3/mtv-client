import { useState } from 'react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import { useAccountStore, useRestoreStore, useGlobalStore } from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutThird from '@/layout/LayoutThird';
import { toast } from 'react-hot-toast';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function QuestionFeature() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const { getLocalAccountInfo } = useAccountStore((state) => state);
  const { setLockStatus } = useGlobalStore((state) => state);
  const { mnemonic, mnemonicType, mnemonicFile } = useRestoreStore(
    (state) => state,
  );
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
    let result;
    console.log(mnemonicType);
    if (mnemonicType === 'text') {
      result = await account.retrieveAccountByMnemonic({
        mnemonic: mnemonic?.trim(),
        textPrivateData: text,
        passwordPrivateData: password,
      });
    } else {
      result = await account.retrieveAccountByUploadMnemonic({
        file: mnemonicFile,
        TextPrivateData: text,
        PasswordPrivateData: password,
        CustomPrivateData: customText,
      });
    }
    if (result.code === '000000') {
      await getLocalAccountInfo();
      setLockStatus(false);
      nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
    } else {
      toast.error(result.msg);
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
    console.log(e);
    setText(e);
  };
  const onPasswordChange = (e: any) => {
    setPassword(e);
  };
  const onCustomChange = (e: any) => {
    setCustomText(e);
  };
  return (
    <LayoutThird title={t('pages.restore.encrypted_safe.title')}>
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
          {t('pages.restore.btn_restore')}
        </Button>
        <div className='text-center text-11px mt-2'>
          {t('pages.restore.hint_password')}
        </div>
      </div>
    </LayoutThird>
  );
}
