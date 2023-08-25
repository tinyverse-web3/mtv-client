import { useState, useMemo } from 'react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Protector() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const query = useMemo(() => {
    return {
      email,
      confirmCode: code,
    };
  }, [email, code]);

  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const submit = async () => {
    setLoading(true);
    try {
      const { code: resCode, msg } = await account.verifyEmail({
        account: email,
        verifyCode: code,
      });
      if (resCode === '000000') {
        nav(ROUTE_PATH.RESTORE_PRIVATEDATA);
      } else {
        toast.error(msg);
      }
    } catch (error) {
      setLoading(false);
      toast.error(t('pages.restore.toast.restore_error'));
    }
    setLoading(false);
  };
  const disabled = useMemo(() => !(email && code), [email, code]);
  return (
    <LayoutThird title={t('pages.restore.title')}>
      <div className='p-4'>
        <div>
          <div className='mb-6'>
            <EmailBox onChange={emailChange} />
          </div>
          <Button
            disabled={disabled}
            size='lg'
            loading={loading}
            className='mx-auto mb-2 w-full'
            onPress={submit}>
            {t('common.confirm')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
