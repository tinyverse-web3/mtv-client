import { Button } from '@/components/form/Button';
import { Image } from '@nextui-org/react';
import LayoutTwo from '@/layout/LayoutTwo';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletStore } from '@/store';
import { useList } from 'react-use';
import { useWalletBalance } from '@/lib/hooks';
interface AssetsTokenItemProps {
  icon?: string;
  symbol: string;
  balance?: number | string;
  dollar?: number | string;
}
const AssetsTokenItem = ({
  icon,
  symbol,
  balance,
  dollar,
}: AssetsTokenItemProps) => {
  return (
    <div className='flex items-center justify-between h-18 border-b-1 border-b-solid border-b-gray-200'>
      <div className='flex items-center'>
        {icon && (
          <Image
            src={icon}
            className='w-9 h-9 bg-gray-200 rounded-full mr-6'></Image>
        )}
        <span className='text-4 font-600'>{symbol}</span>
      </div>
      <div>
        <div className='text-3.5 font-600 text-right'>{balance}</div>
        {dollar && <div className='text-2  text-right'>${dollar}</div>}
      </div>
    </div>
  );
};
interface AssetsNftItemProps {
  icon: string;
}
const AssetsNftItem = ({ icon }: AssetsNftItemProps) => {
  return (
    <div className='p-2 border border-solid border-gray-200'>
      <Image src={icon} className='w-20 h-20' />
    </div>
  );
};
export default function AssetsIndex() {
  const [assetsType, setAssetsType] = useState('token');

  const { wallet } = useWalletStore((state) => state);
  const [list] = useWalletBalance();
  const assetsTypes = [
    {
      label: '代币',
      value: 'token',
    },
    {
      label: 'NFT',
      value: 'NFT',
    },
  ];
  return (
    <LayoutTwo title='私密聊天'>
      <div className='p-6'>
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
      </div>
    </LayoutTwo>
  );
}
