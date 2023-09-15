import { useState } from 'react';
import { Button } from '@/components/form/Button';
import { Textarea } from '@/components/form/Textarea';
import { useNavigate } from 'react-router-dom';
import { useRestoreStore, useAccountStore, useGlobalStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react'

export default function Phrase() {
  const nav = useNavigate();
  const { t} = useTranslation();
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const { setMnemonic, setMnemonicFile } = useRestoreStore((state) => state);
  const { getLocalAccountInfo } = useAccountStore((state) => state);
  const { setLockStatus } = useGlobalStore((state) => state);
  const [type, setType] = useState('file');
  const types = [
    {
      label: t('pages.restore.phrase.tab_file'),
      value: 'file',
    },
    {
      label: t('pages.restore.phrase.tab_text'),
      value: 'text',
    },
  ];
  const importHandler = async () => {
    if (phrase) {
      setLoading(true);
      const result = await account.retrieveAccountByMnemonic({
        mnemonic: phrase?.trim(),
      });
      if (result.code === '000000') {
        await getLocalAccountInfo();
        setLockStatus(false);
        nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      } else {
        toast.error(result.msg);
      }
      setLoading(false);
    }
  };
  const fileChange = async (e: any) => {
    const image = e.target.files[0];
    if (image) {
      setMnemonicFile(image);
      nav(ROUTE_PATH.RESTORE_PHRASE_FEATURE);
    }
    e.target.value = '';
  };
  const phraseChange = (e: any) => {
    setPhrase(e);
  };

  return (
    <LayoutThird title={t('pages.restore.phrase.title')}>
      <div className='pt-6 px-6'>
        <div className='flex mb-6'>
          {types.map((item) => (
            <div className='min-w-30 px-4 flex justify-center' key={item.value}>
              <div
                className={`${
                  type === item.value
                    ? 'border-b-2 border-b-solid text-blue-500'
                    : ''
                } `}
                onClick={() => setType(item.value)}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {type === 'file' ? (
          <div>
            <div className='border border-solid border-gray-300 flex justify-center items-center p-8 rounded w-40 h-40 mx-auto mb-2'>
              <label className='w-full h-full flex flex-col  items-center justify-center text-blue-500'>
                {/* <img src='/upload.png' alt='' /> */}
                <Icon icon='mdi:cloud-upload-outline' className='text-5xl'/>
                <div className='text-md'>
                  {t('common.upload.title')}
                </div>
                <input
                  type='file'
                  onChange={fileChange}
                  className='invisible w-0 h-0'
                />
              </label>
            </div>
            <div className='text-center text-xs '>{t('pages.restore.phrase.upload_hint')}</div>
          </div>
        ) : (
          <>
            <div className='mb-6'>
              <Textarea
                bordered
                fullWidth
                rows={3}
                value={phrase}
                onChange={phraseChange}
                placeholder={t('pages.restore.phrase.input_placeholder')}
                initialValue=''
              />
            </div>
            <Button
              className='mx-auto w-full'
              disabled={!phrase}
              loading={loading}
              onPress={importHandler}>
              {t('pages.restore.btn_restore')}
            </Button>
          </>
        )}
      </div>
    </LayoutThird>
  );
}
