import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import LayoutThird from '@/layout/LayoutThird';
import { Input as NextInput, Row, Button } from '@nextui-org/react';
import { usePasswordStore, useAccountStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import { useSearchParams } from 'react-router-dom';
import { useMap } from 'react-use';
import { toast } from 'react-hot-toast';
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
    <LayoutThird title={`${type === 'add' ? t('common.create') : t('common.edit')}${t('pages.space.password.title')}`}>
      <div className='p-6'>
        <div className='mb-4'>
          <div className='mb-2'>{t('common.title')}</div>
          <Input
            value={data.Title}
            maxLength={300}
            onChange={(e: string) => set('Title', e?.trim())}
            placeholder={t('common.title')}
          />
        </div>
        <div className='mb-4'>
          <div className='mb-1'>{t('common.account')}</div>
          <Input
            value={data.Account}
            maxLength={300}
            onChange={(e: string) => set('Account', e?.trim())}
            placeholder={t('common.account')}
          />
        </div>
        <div className='mb-4'>
          <div className='mb-1'>{t('common.password.title')}</div>
          <NextInput.Password
            value={data.Password}
            fullWidth
            maxLength={300}
            className=''
            onChange={(e: any) => set('Password', e.target.value?.trim())}
            placeholder={t('common.password.title')}
          />
        </div>
        <div className='mb-4'>
          <div className='mb-1'>{t('common.link')}</div>
          <Input
            value={data.Url}
            maxLength={300}
            onChange={(e: string) => set('Url', e?.trim())}
            placeholder={t('common.link')}
          />
        </div>
        {/* <Row className='mb-8' justify='center'>
          <span className='mb-2'>备注</span>
          <Textarea
            value={data.remark}
            maxLength={300}
            onChange={(e: string) => set('remark', e?.trim())}
            placeholder='备注'
          />
        </Row> */}
        <Row className='' justify='center'>
          <Button
            color='secondary'
            disabled={!data.Account || !data.Password || !data.Title}
            className='m-auto w-full'
            onPress={saveHandler}
            size='md'>
            {t('common.save')}
          </Button>
        </Row>
      </div>
    </LayoutThird>
  );
}
