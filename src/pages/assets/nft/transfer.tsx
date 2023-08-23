import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { Card } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { useEffect, useState } from 'react';
import { useMap } from 'react-use';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Transfer() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const id = params.get('id');
  const [data, { set, setAll, remove, reset }] = useMap({
    WalletAddr: '',
    Amount: '',
  });
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
  return (
    <LayoutThird className='h-full' title={t('pages.assets.transfer.title')}>
      <div className='p-4'>
        <div className='mb-4'>
          <div className='mb-2'>{t('pages.assets.transfer.nft_name')}</div>
          <Card>
            <Card.Body>
              <div className='flex'>
                <div className='text-4 break-all'>{id}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <Input
          label={t('pages.assets.transfer.to_address')}
          placeholder={t('pages.assets.transfer.to_placeholder')}
          className='mb-4'
          value={data.WalletAddr}
          onChange={(e: string) => set('WalletAddr', e.trim())}
        />

        <Input
          label={t('pages.assets.transfer.nft_point')}
          placeholder={t('pages.assets.transfer.nft_point_placeholder')}
          typ='number'
          className='mb-4'
          value={data.Amount}
          onChange={(e: string) => set('Amount', e.trim())}
        />

        <Button className='w-full' loading={loading} onClick={handleTransfer}>
          {t('pages.assets.btn_transfer')}
        </Button>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
