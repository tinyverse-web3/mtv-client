import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { usePasswordStore } from '@/store';
import { useSearchParams } from 'react-router-dom';
import { useList, useMap } from 'react-use';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';

export default function ImportWalletDetails() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { add, getById, update } = usePasswordStore((state) => state);
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const walletNet = searchParams.get('walletNet');
  const [data, { set, setAll, remove, reset }] = useMap({
    Name: '',
    WalletNet: walletNet || '',
  });
  const [emptyList, setEmptyList] = useState<number[]>([]);
  const [list, { updateAt }] = useList<string>(
    Array.from<string>({ length: 24 }).fill(''),
  );
  const [btnDisabled, setBtnDisabled] = useState(false);

  const changeHandler = (i: number, value: string) => {
    updateAt(i, value);
  };
  
  const saveHandler = async (e: any) => {
    if (!verify()) {
      toast.error(t('pages.assets.token.phrase_length_toast_error'));
    } else {
      let result: any = {};
      setBtnDisabled(true)
      let mnemonic = list.join(' ').trim()
      console.log('walletNet = ' + walletNet)
      if (walletNet === 'ETH') {
        result = await account.importEthWallet(data.Name, mnemonic);
      } else if (walletNet === 'BTC') {
        result = await account.importBtcWallet(data.Name, mnemonic);
      }

      if (result.code !== '000000') {
        toast.error(result.msg);
        setBtnDisabled(false)
        return
      }

      nav(ROUTE_PATH.ASSETS_INDEX);
    }
  };

  const isNotEmpty = (arr: string[], count: number): boolean => {
    const slicedArray = arr.slice(0, count);
    return slicedArray.every((value) => value.trim() !== ''); // 检查每个元素是否不为空
  };

  const nonEmptyCount = list.filter((value) => value.trim() !== '').length;

  const verify = (): boolean => {
    //verify phrase count
    if(isNotEmpty(list, 24)){
      return true
    }
    if(isNotEmpty(list, 18) && (nonEmptyCount <= 18)){
      return true
    }
    if(isNotEmpty(list, 12) && (nonEmptyCount <= 12)){
      return true
    }
    return false
  }

  return (
    <LayoutThird title={t('pages.assets.token.add_wallet')}>
      <div className='p-6'>
        <div className='mb-6'>
          <Input
            value={data.Name}
            maxLength={300}
            onChange={(e: string) => set('Name', e)}
            placeholder={t('pages.assets.token.wallet_name')}
          />
        </div>
        <div className='mb-2'>{t('pages.assets.token.phrase_title')}</div>
        <div className='grid grid-cols-3 gap-4 mb-4'>
          {list.map((v, i) => (
            <div key={i}>
              <Input
                aria-label='text'
                value={v}
                className='text-center'
                onChange={(e: string) => changeHandler(i, e)}></Input>
            </div>
          ))}
        </div>
        <div className=''>
          <Button
            color='purple'
            disabled={!data.Name || !verify() || btnDisabled}
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
