import { useEffect, useState } from 'react';
import account from '@/lib/account/account';

export const usePoint = () => {
  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    const { Balance: _balance } = await account.getBalance();
    setBalance(_balance);
  };
  useEffect(() => {
    getBalance();
  }, []);

  return { balance };
};
