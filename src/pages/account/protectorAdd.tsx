import { useState, useMemo } from 'react';
import { Checkbox } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import account from '@/lib/account/account';
import { useAccountStore, useGlobalStore } from '@/store';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

export default function ProtectorAdd() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getLocalAccountInfo, accountInfo } = useAccountStore((state) => state);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const checkboxChange = (e: boolean) => {
    setChecked(e);
  };
  const oauthGoogle = async (Code: string) => {
    const { code } = await account.oauthGoogle(Code);
    console.log(code);
    if (code === '000000') {
      await getLocalAccountInfo();
      toast.success(t('common.toast.bind_success'));
    }
  };
  console.log(1231231);
  const login = useGoogleLogin({
    onSuccess: ({ code }) => {
      if (code) {
        oauthGoogle(code);
      }
    },
    flow: 'auth-code',
  });
  const submit = async () => {
    try {
      const { code: resCode, msg } = await account.addGuardian({
        account: email,
        verifyCode: code,
        type: 'email',
      });
      if (resCode === '000000') {
        await getLocalAccountInfo();
        toast.success(t('common.toast.bind_success'));
      } else {
        toast.error(msg || t('common.toast.bind_error'));
      }

      nav(-1);
    } catch (error) {
      await toast.error(t('common.toast.bind_error'));
    }
  };
  const disabled = useMemo(
    () => !(checked && email && code),
    [checked, email, code],
  );
  return (
    <LayoutThird title={t('pages.account.protector.add_title')}>
      <div className='p-4'>
        <div className='text-14px mb-6'>
          {t('pages.account.protector.hint')}
        </div>
        <div>
          <div className='mb-6'>
            <EmailBox onChange={emailChange} />
          </div>
          <Checkbox
            className='mb-3'
            aria-label='checkbox'
            // isSelected={checked}
            onValueChange={checkboxChange}>
            <div className='text-3'>
              {t('pages.account.protector.hint_two')}
            </div>
          </Checkbox>
          <Button
            disabled={disabled}
            size='lg'
            loading={loading}
            className='mx-auto mb-2 w-full'
            onPress={submit}>
            {t('pages.account.protector.confirm')}
          </Button>
          <Button size='lg' disabled={accountInfo.hasGoogleAccount} className='mx-auto mb-2 w-full' onPress={login}>
            {t('pages.account.protector.google')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
