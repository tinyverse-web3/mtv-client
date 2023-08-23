import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { useState } from 'react';
import { useMap } from 'react-use';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Transfer() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, { set, setAll, remove, reset }] = useMap({
    WalletAddr: '',
    Amount: '',
    Gas: '3',
    Comment: '',
  });

  const handleTransfer = async () => {
    setLoading(true);
    const { code, msg } = await account.transferPoint({
      WalletAddr: data.WalletAddr,
      Amount: Number(data.Amount),
      Gas: Number(data.Gas),
      Comment: data.Comment,
    });
    if (code === '000000') {
      toast.success(t('pages.assets.token.transfer_success'));
    } else {
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <LayoutThird className='h-full' title={t('pages.assets.btn_transfer')}>
      <div className='p-4'>
        <Input
          label={t('pages.assets.transfer.to_address')}
          placeholder={t('pages.assets.transfer.to_placeholder')}
          className='mb-4'
          value={data.WalletAddr}
          onChange={(e: string) => set('WalletAddr', e.trim())}
        />
        <Input
          label={t('pages.assets.transfer.amount')}
          placeholder={t('pages.assets.transfer.amount_placeholder')}
          className='mb-4'
          typ='number'
          value={data.Amount}
          onChange={(e: string) => set('Amount', e.trim())}
        />
        <Input
          label={t('pages.assets.transfer.gas')}
          placeholder={t('pages.assets.transfer.gas_placeholder')}
          typ='number'
          className='mb-4'
          readOnly
          value={data.Gas}
          onChange={(e: string) => set('Gas', e.trim())}
        />
        <Input
          label={t('pages.assets.transfer.remark')}
          placeholder={t('pages.assets.transfer.remark_placeholder')}
          className='mb-4'
          value={data.Comment}
          onChange={(e: string) => set('Comment', e.trim())}
        />
        <Button className='w-full' loading={loading} onClick={handleTransfer}>
          {t('pages.assets.btn_transfer')}
        </Button>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
