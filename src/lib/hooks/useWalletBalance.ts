import { useChainStore, Token } from '@/store';
import { useEffect, useMemo } from 'react';
import { useList } from 'react-use';

// 获取链上代币余额
const getChainToeken = async (address: string, rpc_url: string) => {
  // const provider = new ethers.JsonRpcProvider(rpc_url);
  // const balance = await provider.getBalance(address);
  // return ethers.formatEther(balance);
};

// 自定义 Hook，用于获取钱包余额
export const useWalletBalance = () => {
  const chain = useChainStore((state) => state.chain);
  const [list, { set }] = useList<Token>([]);

  // 获取所有代币余额
  const getAllBalance = async () => {
    const tokenList: Token[] = [];
    // const { address } =   {};
    // if (address && chain) {
    //   const { rpc_url } = chain;
    //   const tokenBalance = await getChainToeken(address, rpc_url);
    //   tokenList.push({
    //     symbol: chain.symbol,
    //     icon: chain.icon,
    //     // balance: tokenBalance,
    //   });
    // }
    set(tokenList);
  };

  // 当钱包或链变化时，重新获取余额
  useEffect(() => {
    getAllBalance();
  }, [chain]);

  return [list];
};
