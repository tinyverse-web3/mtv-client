import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Wallet } from '@/lib/wallet';

interface WalletState {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
}

export const useWalletStore = create<WalletState>()(
  devtools((set) => ({
    wallet: null,
    setWallet: (wallet: Wallet) => {
      set({ wallet });
    },
  })),
);
