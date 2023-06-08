import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Token {
  contract?: string;
  symbol: string;
  balance?: number | string;
  dollar?: number | string;
  icon?: string;
}
interface ChainState {
  rpc_url: string;
  id: string | number;
  name: string;
  icon?: string;
  symbol: string;
  tokens: Token[];
  scan_url?: string;
}
interface ImState {
  chainList: ChainState[];
  tokenList: Token[];
  chain?: ChainState;
  chooseChain: (id: string | number) => void;
  changeTokens: (tokens: Token[]) => void;
}

const chainList: ChainState[] = [
  {
    rpc_url: 'https://goerli.blockpi.network/v1/rpc/public',
    id: 5,
    name: 'Goerli',
    scan_url: 'https://goerli.etherscan.io',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    symbol: 'ETH',
    tokens: [
      {
        contract: '0x6b175474e89094c44da98b954eedeac495271d0f',
        symbol: 'DAI',
        balance: 0,
        icon: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png?1574218774',
      },
    ],
  },
];
export const useChainStore = create<ImState>()(
  devtools(
    persist(
      (set, get) => ({
        chainList: chainList,
        tokenList: chainList[0].tokens || [],
        chain: chainList[0],
        chooseChain: (id: string | number) => {
          const chainList = get().chainList;
          const chain = chainList.find((item) => item.id === id);
          set({ chain, tokenList: chain?.tokens || [] });
        },
        changeTokens: (tokens: Token[]) => {
          set({ tokenList: tokens });
        },
      }),
      {
        name: 'chain-store',
      },
    ),
  ),
);
