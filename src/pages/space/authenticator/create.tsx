import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { CopyIcon } from '@/components/CopyIcon';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Edit() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [key, setKey] = useState('');

  const generateGoogleSecret = async () => {
    const { code, msg, data } = await account.generateGoogleSecret();
    if (code === '000000') {
      setKey(data);
    } else {
      toast.error(msg);
    }
  };
  useEffect(() => {
    generateGoogleSecret();
  }, []);
  return (
    <LayoutThird title={t('pages.space.authenticator.create_title')}>
      <div className='p-6'>
        <div className='mb-8'>
          <div className='mr-4'>{key}</div>
          <CopyIcon text={key} />
        </div>
      </div>
    </LayoutThird>
  );
}
