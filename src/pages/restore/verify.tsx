import { useState, useMemo } from 'react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useRequest } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useQuestionStore } from '@/store';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function RestoreVerifyEmail() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const { setPublicKey, setList, setSssData, setType } = useQuestionStore(
    (state) => state,
  );
  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const submit = async () => {
    const {
      code: resCode,
      data,
      msg,
    } = await account.verifyEmail({
      account: email,
      verifyCode: code,
    });
    if (resCode === '000000') {
      nav(ROUTE_PATH.RESTORE_QUESTION_FEATURE);
    }
    setLoading(false);
  };
  const disabled = useMemo(() => !(email && code), [email, code]);
  return (
    <LayoutThird title={t('pages.restore.question.verify')}>
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
