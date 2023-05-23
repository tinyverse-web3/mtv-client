import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Wallet } from '@/lib/account/wallet';

interface WalletState {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>()(
  devtools((set, get) => ({
    wallet: null,
    setWallet: (wallet: Wallet) => {
      console.log(wallet)
      set({ wallet });
    },
    reset: async () => {
      set({ wallet: null });
    },
  })),
);
