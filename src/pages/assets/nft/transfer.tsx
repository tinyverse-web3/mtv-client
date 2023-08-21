import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { Card } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { useEffect, useState } from 'react';
import { useMap } from 'react-use';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Transfer() {
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
      await toast.success('转账成功');
      nav(-2)
    } else {
      toast.error(msg);
    }
    setLoading(false);
  };
  return (
    <LayoutThird className='h-full' title='转账'>
      <div className='p-4'>
        <div className='mb-4'>
          <div className='mb-2'>NFT名称</div>
          <Card>
            <Card.Body>
              <div className='flex'>
                <div className='text-4 break-all'>{id}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <Input
          label='目标地址'
          placeholder='请输入对方钱包公钥'
          className='mb-4'
          value={data.WalletAddr}
          onChange={(e: string) => set('WalletAddr', e.trim())}
        />

        <Input
          label='转移的NFT的积分收入'
          typ='number'
          placeholder='请输入转移的NFT的积分收入'
          className='mb-4'
          value={data.Amount}
          onChange={(e: string) => set('Amount', e.trim())}
        />

        <Button className='w-full' loading={loading} onClick={handleTransfer}>
          转账
        </Button>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
