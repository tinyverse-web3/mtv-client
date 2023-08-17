import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { useState } from 'react';
import { useMap } from 'react-use';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
export default function Transfer() {
  const [ loading , setLoading ] = useState(false)
  const [data, { set, setAll, remove, reset }] = useMap({
    WalletAddr: '',
    Amount: '',
    Gas: '3',
    Comment: '',
  });

  const handleTransfer = async () => {
    setLoading(true)
    const { code, msg } = await account.transferPoint({
      WalletAddr: data.WalletAddr,
      Amount: Number(data.Amount),
      Gas: Number(data.Gas),
      Comment: data.Comment,
    });
    if (code === '000000') {
      toast.success('转账成功');
    } else {
      toast.error(msg);
    }
    setLoading(false)
  };

  return (
    <LayoutThird className='h-full' title='转账'>
      <div className='p-4'>
        <Input
          label='目标地址'
          placeholder='请输入对方钱包公钥'
          className='mb-4'
          value={data.WalletAddr}
          onChange={(e: string) => set('WalletAddr', e.trim())}
        />
        <Input
          label='转账金额'
          placeholder='请输入转账金额'
          className='mb-4'
          typ='number'
          value={data.Amount}
          onChange={(e: string) => set('Amount', e.trim())}
        />
        <Input
          label='转账小费'
          typ='number'
          placeholder='请输入转账小费'
          className='mb-4'
          readOnly
          value={data.Gas}
          onChange={(e: string) => set('Gas', e.trim())}
        />
        <Input
          label='转账备注'
          placeholder='请输入转账备注'
          className='mb-4'
          value={data.Comment}
          onChange={(e: string) => set('Comment', e.trim())}
        />
        <Button className='w-full' loading={loading} onClick={handleTransfer}>转账</Button>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
