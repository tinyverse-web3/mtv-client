import { useEffect, useState } from 'react';
import account from '@/lib/account/account';

export const usePoint = () => {
  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    const { code, data } = await account.getBalance();
    if (code === '000000') {
      const { Balance: _balance } = data;
      setBalance(_balance);
    }
  };
  useEffect(() => {
    getBalance();
  }, []);

  return { balance };
};
