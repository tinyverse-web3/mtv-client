import { signMessage } from '@/lib/utils';
import { useWalletStore } from '@/store';
import { useMemo, useState } from 'react';

export const useSignMessage = (message: string) => {
  const wallet = useWalletStore((state) => state.wallet);
  const sign = useMemo(() => {
    const { address, privateKey } = wallet?.wallet || {};
    if (address && privateKey && message) {
      const _sign = signMessage(message, {
        address,
        privateKey,
      });
      return _sign;
    }
  }, [message, wallet]);
  return sign;
};
