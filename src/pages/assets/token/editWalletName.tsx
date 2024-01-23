import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { useSearchParams } from 'react-router-dom';
import { useMap } from 'react-use';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function EditWalletName() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const walletName = searchParams.get('walletName');
  const [data, { set, setAll, remove, reset }] = useMap({
    Name: walletName || '',
  });

  
  const saveHandler = async (e: any) => {
    if(data.Name === walletName) {
     toast.error(t('pages.assets.token.edit_wallet_name_error'))
     return
    }
    //await update(data);
    nav(-1);
  };
  useEffect(() => {
    if (walletName) {
      // const detail = getByName(walletName);
      // setAll(detail as any);
      set('Name', walletName);
    }
  }, [walletName]);
  return (
    <LayoutThird title={t('pages.assets.token.edit_wallet_name')}>
      <div className='p-6'>
        <div className='mb-4'>
          <Input
            value={data.Name}
            maxLength={300}
            onChange={(e: string) => set('Name', e)}
            placeholder={t('pages.assets.token.wallet_name')}
          />
        </div>
        <div className=''>
          <Button
            color='purple'
            disabled={!data.Name}
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
