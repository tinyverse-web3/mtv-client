import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { ContactPopover } from '@/components/ContactPopover';
import LayoutThird from '@/layout/LayoutThird';
import { useMemo, useState, useEffect } from 'react';
import { useMap } from 'react-use';
import account from '@/lib/account/account';
import { usePoint } from '@/lib/hooks';
import { toast } from 'react-hot-toast';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useAssetsStore } from '@/store';

export default function Transfer() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { state = {} } = useLocation();
  const { address = '' } = (state as any) || {};
  const [loading, setLoading] = useState(false);
  const { balance: pointBalance } = usePoint();
  const { toAddress } = useAssetsStore((state) => state);
  const [data, { set, setAll, remove, reset }] = useMap({
    WalletAddr: address,
    Amount: '',
    Gas: '3',
    Comment: '',
  });
  const selectContact = (item: any) => {};
  const toSelectContact = () => {
    nav(ROUTE_PATH.ASSETS_CONTACT);
  };
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
  const disabled = useMemo(
    () =>
      !data.WalletAddr ||
      Number(data.Amount) > pointBalance ||
      Number(data.Amount) <= 0,
    [data.WalletAddr, data.Amount],
  );
  useEffect(() => {
    if (toAddress) {
      set('WalletAddr', toAddress);
    }
  }, [toAddress]);
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
            endContent={
              <Icon
                icon='mdi:account-supervisor-outline'
                onClick={toSelectContact}
                className='text-2xl text-blue-500'></Icon>
            }
            value={data.WalletAddr}
            onChange={(e: string) => set('WalletAddr', e)}
          />
          {/* <ContactPopover onChange={selectContact} /> */}
        </div>
        <div className='mb-3'>
          <div className='mb-2 flex justify-between items-center text-blue-500'>
            <span>{t('pages.assets.transfer.amount')}</span>
            <span className='text-sm'>{[pointBalance]} TVS</span>
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
              readOnly
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
