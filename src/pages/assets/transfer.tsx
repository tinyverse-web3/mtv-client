import { Button } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { useState } from 'react';

export default function Transfer() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddressChange = (value: string) => {
    setAddress(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleTransfer = () => {
    // 在此处添加转账逻辑
  };

  return (
    <>
      <Input
        label='目标地址'
        placeholder='请输入目标地址'
        value={address}
        onChange={handleAddressChange}
      />
      <Input
        label='转账金额'
        placeholder='请输入转账金额'
        value={amount}
        onChange={handleAmountChange}
      />
      <Button onClick={handleTransfer}>转账</Button>
    </>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
