import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useAccountStore, useWalletStore } from '@/store';
import account from '@/lib/account/account';
import { useCountDown } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
interface Props {
  onChange: (data: { email: string; code: string }) => void;
}
export const EmailBox = ({ onChange }: Props) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const { start, text, flag, reset } = useCountDown(60, t('common.code_text'));
  const emailChange = (e: any) => {
    const { value } = e.target;
    setEmail(value);
    reset();
    onChange && onChange({ email: value, code: verifyCode });
  };
  const verifyCodeChange = async (e: any) => {
    const { value } = e.target;
    await setVerifyCode(value);
    onChange && onChange({ email, code: value });
  };
  const sendVerify = async () => {
    if (email && flag) {
      setCodeLoading(true);
      const { code, msg } = await account.sendVerifyCode({
        type: 'email',
        account: email,
      });
      if (code !== '000000') {
        toast.error(msg);
        setCodeLoading(false);
        return;
      }
      start();
      toast.success(t('common.send_code_success'));
      setCodeLoading(false);
    }
  };
  const emailBlur = () => {};
  return (
    <div>
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
        className='mb-6'
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
          placeholder={t('common.code')}
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
    </div>
  );
};
