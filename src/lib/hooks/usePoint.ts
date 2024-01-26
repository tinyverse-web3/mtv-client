import { useEffect, useState } from 'react';
import { useAssetsStore } from '@/store';
import account from '@/lib/account/account';

export const usePoint = () => {
  const { tvs, setTvs } = useAssetsStore((state) => state);

  const getBalance = async () => {
    const { code, data } = await account.getTvsBalance();
    if (code === '000000') {
      const { Balance: _balance } = data;
      setTvs(_balance);
    }
  };
  useEffect(() => {
    getBalance();
  }, []);

  return { balance: tvs };
};
