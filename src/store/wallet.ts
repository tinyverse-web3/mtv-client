import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Wallet } from '@/lib/wallet';

interface WalletState {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>()(
  devtools((set, get) => ({
    wallet: null,
    setWallet: (wallet: Wallet) => {
      set({ wallet });
    },
    reset: async () => {
      const wallet = get().wallet;
      set({ wallet: null });
    },
  })),
);
