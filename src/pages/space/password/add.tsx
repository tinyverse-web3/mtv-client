import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { Password } from '@/components/form/Password';
import LayoutThird from '@/layout/LayoutThird';
import { usePasswordStore, useAccountStore } from '@/store';
import { useSearchParams } from 'react-router-dom';
import { useMap } from 'react-use';
import { useTranslation } from 'react-i18next';

export default function Edit() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { add, getById, list, update } = usePasswordStore((state) => state);
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id') as string;
  const [data, { set, setAll, remove, reset }] = useMap({
    Id: id,
    Title: '',
    Account: '',
    Password: '',
    Url: '',
  });
  const saveHandler = async (e: any) => {
    if (type === 'add') {
      await add(data);
    } else {
      await update(data);
    }
    nav(-1);
  };
  useEffect(() => {
    if (id) {
      const detail = getById(id);
      setAll(detail as any);
    }
  }, [id]);
  return (
    <LayoutThird
      title={`${type === 'add' ? t('common.create') : t('common.edit')}${t(
        'pages.space.password.title',
      )}`}>
      <div className='p-6'>
        <div className='mb-4'>
          <div className='mb-2'>{t('common.title')}</div>
          <Input
            value={data.Title}
            maxLength={300}
            onChange={(e: string) => set('Title', e)}
            placeholder={t('common.title')}
          />
        </div>
        <div className='mb-4'>
          <div className='mb-1'>{t('common.account')}</div>
          <Input
            value={data.Account}
            maxLength={300}
            onChange={(e: string) => set('Account', e)}
            placeholder={t('common.account')}
          />
        </div>
        <div className='mb-4'>
          <div className='mb-1'>{t('common.password.title')}</div>
          <Password
            value={data.Password}
            fullWidth
            maxLength={300}
            className=''
            onChange={(e: any) => set('Password', e)}
            placeholder={t('common.password.title')}
          />
        </div>
        <div className='mb-4'>
          <div className='mb-1'>{t('common.link')}</div>
          <Input
            value={data.Url}
            maxLength={300}
            onChange={(e: string) => set('Url', e)}
            placeholder={t('common.link')}
          />
        </div>
        <div className=''>
          <Button
            color='secondary'
            disabled={!data.Account || !data.Password || !data.Title}
            className='m-auto w-full'
            onPress={saveHandler}
            size='md'>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
