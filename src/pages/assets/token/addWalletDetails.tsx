import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { usePasswordStore } from '@/store';
import { useSearchParams } from 'react-router-dom';
import { useMap } from 'react-use';
import { useTranslation } from 'react-i18next';
import account, { Account } from '@/lib/account/account';
import { ROUTE_PATH } from '@/router';
import toast from 'react-hot-toast';

export default function AddWalletDetails() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { add, getById, update } = usePasswordStore((state) => state);
  const [searchParams] = useSearchParams();
  const opType = searchParams.get('opType');
  const id = searchParams.get('id') as string;
  const walletNet = searchParams.get('walletNet');
  const [data, { set, setAll, remove, reset }] = useMap({
    Id: id,
    Name: '',
    WalletNet: walletNet || '',
  });
  const [btnDisabled, setBtnDisabled] = useState(false);

  const saveHandler = async (e: any) => {
    let code:string = ''
    let msg:string = ''
    if (opType === 'add') {
      setBtnDisabled(true)
      console.log('walletNet = ' + walletNet)
      if (walletNet === 'ETH') {
        ({ code, msg } = await account.addEthWallet(data.Name))
      } else if (walletNet === 'BTC') {
        ({ code, msg } = await account.addBtcWallet(data.Name));
      }

      if (code !== '000000') {
        toast.error(msg);
        return
      }
      
    } else if (opType === 'edit') {
      //await update(data);
    }
    nav(ROUTE_PATH.ASSETS_INDEX);
  };
  useEffect(() => {
    if (id) {
      const detail = getById(id);
      setAll(detail as any);
    }
  }, [id]);
  return (
    <LayoutThird title={t('pages.assets.token.add_wallet')}>
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
            disabled={!data.Name || btnDisabled}
            className='m-auto w-full'
            onPress={saveHandler}
            size='md'>
            {t('common.confirm')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
