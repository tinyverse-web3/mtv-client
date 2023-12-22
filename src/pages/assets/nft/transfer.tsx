import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { Card, CardBody } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { useEffect, useState } from 'react';
import { useMap } from 'react-use';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useAssetsStore } from '@/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATH } from '@/router';
import { Icon } from '@iconify/react';
import { useNativeScan } from '@/lib/hooks';

export default function Transfer() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const id = params.get('id');
  const { toAddress } = useAssetsStore((state) => state);
  const [data, { set, setAll, remove, reset }] = useMap({
    WalletAddr: toAddress,
    Amount: '',
  });
  const { result, start } = useNativeScan();
  const toSelectContact = () => {
    nav(ROUTE_PATH.ASSETS_CONTACT);
  };
  const handleTransfer = async () => {
    setLoading(true);
    const { code, msg } = await account.transferNft({
      WalletAddr: data.WalletAddr,
      Amount: Number(data.Amount),
      NftName: id,
    });
    if (code === '000000') {
      await toast.success(t('pages.assets.token.transfer_success'));
      nav(-2);
    } else {
      toast.error(msg);
    }
    setLoading(false);
  };
  const toScan = () => {
    start();
  };
  useEffect(() => {
    if (result) {
      set('WalletAddr', result);
    }
  }, [result]);
  return (
    <LayoutThird className='h-full' title={t('pages.assets.transfer.title')}>
      <div className='p-4'>
        <div className='mb-4'>
          <div className='mb-2 text-blue-500'>
            {t('pages.assets.transfer.nft_name')}
          </div>
          <div className='rounded-2xl bg-gray-100'>
            <Input
              typ='number'
              variant='default'
              readOnly
              className=''
              value={id}
            />
          </div>
        </div>
        <div className='mb-4'>
          <div className='mb-2 text-blue-500'>
            {t('pages.assets.transfer.to_address')}
          </div>
          <Input
            variant='default'
            isClearable={false}
            placeholder={t('pages.assets.transfer.to_placeholder')}
            startContent={
              <Icon
                icon='mdi:account-supervisor-outline'
                onClick={toSelectContact}
                className='text-2xl text-blue-500'></Icon>
            }
            endContent={
              <Icon
                icon='mdi:line-scan'
                className=' text-xl   text-blue-500'
                onClick={toScan}></Icon>
            }
            value={data.WalletAddr}
            onChange={(e: string) => set('WalletAddr', e)}
          />
        </div>
        <div className='mb-4'>
          <div className='mb-2 text-blue-500'>
            {t('pages.assets.transfer.nft_point')}
          </div>
          <div className='rounded-2xl bg-gray-100'>
            <Input
              placeholder={t('pages.assets.transfer.nft_point_placeholder')}
              typ='number'
              variant='default'
              className=''
              value={data.Amount}
              onChange={(e: string) => set('Amount', e)}
            />
          </div>
        </div>

        <Button className='w-full' loading={loading} onClick={handleTransfer}>
          {t('pages.assets.btn_transfer')}
        </Button>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
