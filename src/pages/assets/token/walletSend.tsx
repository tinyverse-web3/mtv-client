import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { useMemo, useState, useEffect } from 'react';
import { useMap } from 'react-use';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useNativeScan } from '@/lib/hooks';
import { useWalletStore } from '@/store';


interface WalletDetails {
  Name: string;
  Type: string;
  Balance: number; // 假设 Balance 是一个数字类型
}

export default function WalletSend() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { state = {} } = useLocation();
  const { address = '' } = (state as any) || {};
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const walletName = searchParams.get('walletName') as string;
  const walletType = searchParams.get('walletType') as string;
  const srcAddress = searchParams.get('address') as string;
  const { result, start } = useNativeScan();
  const { getByName } = useWalletStore((state) => state);
  
  const [walletDetails, setWalletDetails] = useState<WalletDetails>({
    Name: walletName,
    Type: walletType,
    Balance : 0,
  })

  const [data, { set, setAll, remove, reset }] = useMap({
    WalletAddr: address,
    Amount: '',
    Gas: '30',
    Comment: '',
  });

  const feachDetails = async () => {
    const detail = await getByName(walletName, walletType);
    console.log("feachDetails detail = " + detail);
    setWalletDetails(detail as any);
    const walletBalance: number = await feachBalance()
    setWalletDetails(prevState => ({
      ...prevState,
      Balance: walletBalance,
    }));
  }

  const feachBalance = async () => {
    let result: any = {};
    if (walletType === 'Bitcoin') {
      result = await account.getBtcBalance(walletName, srcAddress);
    } else if (walletType === 'Ethereum') {
      result = await account.getEthBalance(walletName);
    }
    
    if (result.code !== '000000') {
      toast.error(result.msg);
      return
    }
   return result.data
  }

  useEffect(() => {
    if (walletName) {
      feachDetails();
    }
  }, [walletName]);
 
  const selectContact = (item: any) => {};
  const toSelectContact = () => {
    nav(ROUTE_PATH.ASSETS_CONTACT);
  };
  const handleTransfer = async () => {
    setLoading(true);
    
    let result: any = {};
    if (walletType === 'Bitcoin') {
      result = await account.transferUseBtcWallet(walletName, srcAddress, data.WalletAddr, Number(data.Amount), Number(data.Gas));
    } else if (walletType === 'Ethereum') {
      result = await account.transferUseEthWallet(walletName, data.WalletAddr, Number(data.Amount));
    }

    if (result.code === '000000') {
      toast.success(t('pages.assets.token.transfer_success'));
    } else {
      toast.error(result.msg);
    }
    setLoading(false);
    nav(-1);
  };
  const disabled = useMemo(
    () =>
      !data.WalletAddr ||
      Number(data.Amount) > walletDetails.Balance ||
      Number(data.Amount) <= 0,
    [data.WalletAddr, data.Amount],
  );
  const toScan = () => {
    start();
  };

  useEffect(() => {
    if (result) {
      set('WalletAddr', result);
    }
  }, [result]);
  return (
    <LayoutThird className='h-full' title={t('pages.assets.btn_transfer')}>
      <div className='p-4'>
        <div className='mb-3'>
          <div className='mb-2 text-blue-500'>
            {t('pages.assets.transfer.to_address')}
          </div>
          <Input
            variant='default'
            isClearable={false}
            placeholder={t('pages.assets.transfer.to_placeholder')}
            startContent={
              <Icon icon='mdi:account-supervisor-outline' onClick={toSelectContact} className='text-2xl text-blue-500'></Icon>
            }
            endContent={
              <Icon icon='mdi:line-scan' className=' text-xl text-blue-500' onClick={toScan}></Icon>
            }
            value={data.WalletAddr}
            onChange={(e: string) => set('WalletAddr', e)}
          />
          {/* <ContactPopover onChange={selectContact} /> */}
        </div>
        <div className='mb-3'>
          <div className='mb-2 flex justify-between items-center text-blue-500'>
            <span>{t('pages.assets.transfer.amount')}</span>
            <span className='text-sm'>{[walletDetails.Balance]} {walletDetails.Type}</span>
          </div>
          <div className='rounded-2xl bg-gray-100 mb-3'>
            <Input
              variant='default'
              placeholder='0'
              classNames={{
                inputWrapper: 'h-16',
                input: 'text-lg',
              }}
              typ='number'
              value={data.Amount}
              onChange={(e: string) => set('Amount', e)}
            />
            <Input
              variant='default'
              placeholder={t('pages.assets.transfer.remark_placeholder')}
              className='flex-1'
              classNames={{
                inputWrapper: 'h-12',
                input: '',
              }}
              value={data.Comment}
              onChange={(e: string) => set('Comment', e)}
            />
          </div>
        </div>
        <div className='mb-3'>
          <div className='mb-2 text-blue-500'>
            {t('pages.assets.transfer.gas')}
          </div>
          <div className='rounded-2xl bg-gray-100'>
            <Input
              placeholder={t('pages.assets.transfer.gas_placeholder')}
              typ='number'
              variant='default'
              className='mb-4'
              value={data.Gas}
              onChange={(e: string) => set('Gas', e)}
            />
          </div>
        </div>

        <Button
          className='w-full'
          size='md'
          loading={loading}
          disabled={disabled}
          onClick={handleTransfer}>
          {t('pages.assets.btn_transfer')}
        </Button>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
