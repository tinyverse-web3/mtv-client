import { Button } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import LayoutThird from '@/layout/LayoutThird';
import { useState } from 'react';
import { useMap } from 'react-use';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
export default function Transfer() {
  const [data, { set, setAll, remove, reset }] = useMap({
    WalletAddr: '',
    Amount: '',
    Gas: '3',
    Comment: '',
  });

  const handleTransfer = async () => {
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
  };

  return (
    <LayoutThird className='h-full' title='转账'>
      <div className='p-4'>
        <Input
          label='目标地址'
          placeholder='请输入目标地址'
          className='mb-4'
          value={data.WalletAddr}
          onChange={(e: string) => (data.WalletAddr = e.trim())}
        />
        <Input
          label='转账金额'
          placeholder='请输入转账金额'
          className='mb-4'
          typ='number'
          value={data.Amount}
          onChange={(e: string) => (data.Amount = e.trim())}
        />
        <Input
          label='转账小费'
          typ='number'
          placeholder='请输入转账小费'
          className='mb-4'
          readOnly
          value={data.Gas}
          onChange={(e: string) => (data.Gas = e.trim())}
        />
        <Input
          label='转账备注'
          placeholder='请输入转账备注'
          className='mb-4'
          value={data.Comment}
          onChange={(e: string) => (data.Comment = e.trim())}
        />
        <Button className='w-full' onClick={handleTransfer}>转账</Button>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
