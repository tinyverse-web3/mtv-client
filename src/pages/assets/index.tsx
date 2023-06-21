import { Button } from '@/components/form/Button';
import { Image } from '@nextui-org/react';
import LayoutTwo from '@/layout/LayoutTwo';
import { useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useAccountStore } from '@/store';
import { useList } from 'react-use';
import { useWalletBalance } from '@/lib/hooks';
import { HeaderAccount } from './components/HeaderAccount';
import { Point } from './components/Point';
import { AssetsTokenItem } from './components/AssetsTokenItem';
import { AssetsNftItem } from './components/AssetsNftItem';

export default function AssetsIndex() {
  const [assetsType, setAssetsType] = useState('token');

  const { account, web3AccountSelect } = useAccountStore((state) => state);
  const list = useMemo(() => {
    const web3SubAccount = account.accountInfo.subAccount.filter(
      (v) => v.type === 'web3',
    );
    return [account.accountInfo.pointAccount, ...web3SubAccount] as any;
  }, [account]);
  const subAccount = useMemo<any>(() => {
    let index = list.findIndex((v: any) => v?.address === web3AccountSelect);
    index = Math.max(index, 0);
    return list[index];
  }, [web3AccountSelect, list]);
  // const [list] = useWalletBalance();
  // const assetsTypes = [
  //   {
  //     label: '代币',
  //     value: 'token',
  //   },
  //   {
  //     label: 'NFT',
  //     value: 'NFT',
  //   },
  // ];
  return (
    <LayoutTwo title='私密聊天'>
      <HeaderAccount />
      {subAccount.type === 'point' ? <Point /> : 123}

      {/* <div className='p-6'>
        <div className='flex mb-6'>
          {assetsTypes.map((item) => (
            <div className='w-20 flex justify-center' key={item.value}>
              <div
                className={`${
                  assetsType === item.value
                    ? 'border-b-2 border-b-solid text-blue-5'
                    : ''
                } cursor-pointer`}
                onClick={() => setAssetsType(item.value)}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <div>
          {assetsType === 'token' ? (
            <div>
              {list.map((item) => (
                <AssetsTokenItem
                  icon={item.icon}
                  symbol={item.symbol}
                  key={item.symbol}
                  balance={item.balance}
                  dollar={item.dollar}
                />
              ))}
            </div>
          ) : (
            <div>
              <div className='grid grid-cols-3 grid-gap-6'>
                <AssetsNftItem icon='/logo.png' />
              </div>
            </div>
          )}
        </div>
      </div> */}
    </LayoutTwo>
  );
}
