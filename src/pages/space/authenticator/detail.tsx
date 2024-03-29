import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import LayoutThird from '@/layout/LayoutThird';
import { Button } from '@/components/form/Button';
import account from '@/lib/account/account';
import { useAuthenticatorStore } from '@/store';
import { DelConfirmModel } from '@/components/DelConfirmModel';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Detail() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { list, getList } = useAuthenticatorStore((state) => state);
  const [showStatus, setShowStatus] = useState(false);
  const getAccountSecret = async () => {
    const { code, data } = await account.getAuthenticatorSecret({
      AccountName: id,
    });
    if (code === '000000') {
      setKey(data);
    }
  };
  const showDelModal = async (e: any) => {
    setShowStatus(true);
  };
  const remove = async () => {
    const { code, msg } = await account.delAuthenticatorAccount({
      AccountName: id,
    });

    if (code === '000000') {
      toast.success(t('common.toast.delete_success'));
      await getList();
      nav(-1);
    } else {
      toast.error(msg);
    }
  };
  const delConfirm = async () => {
    await remove();
  };
  const onClose = async () => {
    setShowStatus(false);
  };
  useEffect(() => {
    if (id) {
      setName(id);
      getAccountSecret();
    }
  }, [id]);
  return (
    <LayoutThird title={t('pages.space.authenticator.detail_title')}>
      <div className='p-6'>
        <div className='mb-8'>
          <Input
            value={name}
            maxLength={300}
            readOnly
            placeholder={t('pages.space.authenticator.detail_name')}
          />
        </div>
        <div className='mb-8'>
          <Input
            value={key}
            maxLength={300}
            readOnly
            placeholder={t('pages.space.authenticator.detail_key')}
          />
        </div>
        <div>
          <Button className='w-full' onClick={showDelModal}>
            {t('common.delete')}
          </Button>
        </div>
        <DelConfirmModel
          text={t('pages.space.authenticator.title')}
          show={showStatus}
          onConfirm={delConfirm}
          onClose={onClose}
        />
      </div>
    </LayoutThird>
  );
}
