import { Button } from '@/components/form/Button';
import { Image } from '@nextui-org/react';
import { useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useAccountStore } from '@/store';
import { useList } from 'react-use';
import { useWalletBalance, usePoint } from '@/lib/hooks';
import { HeaderAccount } from './components/HeaderAccount';
import { Point } from './components/Point';
import { AssetsTokenItem } from './components/AssetsTokenItem';
import { NftList } from './components/NftList';
import account from '@/lib/account/account';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

export default function AssetsIndex() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [assetsType, setAssetsType] = useState('token');

  const { web3AccountSelect, accountInfo } = useAccountStore((state) => state);
  // const list = useMemo(() => {
  //   const web3SubAccount = accountInfo.subAccount.filter(
  //     (v) => v.type === 'web3',
  //   );
  //   return [accountInfo.pointAccount, ...web3SubAccount] as any;
  // }, [account]);
  // const subAccount = useMemo<any>(() => {
  //   let index = list.findIndex((v: any) => v?.address === web3AccountSelect);
  //   index = Math.max(index, 0);
  //   return list[index];
  // }, [web3AccountSelect, list]);
  const { balance: pointBalance } = usePoint();
  const [list] = useWalletBalance();
  const assetsTypes = [
    {
      label: t('pages.assets.token.title'),
      value: 'token',
    },
    {
      label: t('pages.assets.nft.title'),
      value: 'NFT',
    },
  ];
  const toAdd = () => {
    nav(ROUTE_PATH.ASSETS_NFT_ADD);
  };
  const toTransfer = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_TRANSFER);
  };
  return (
    <div>
      {/* <HeaderAccount /> */}
      {/* {subAccount.type === 'point' ? <Point /> : 123} */}

      <div className='p-4'>
        <div className='flex justify-between mb-6'>
          <div className='flex'>
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
          {assetsType === 'NFT' && (
            <div
              onClick={toAdd}
              className='i-mdi-plus-circle-outline text-5'></div>
          )}
        </div>

        <div>
          {assetsType === 'token' ? (
            <>
              <div className='mb-20'>
                <AssetsTokenItem
                  icon='/logo.png'
                  symbol={t('pages.assets.token.point_name')}
                  key='point'
                  balance={pointBalance}
                />
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
              <Button onClick={toTransfer} className="mx-auto">{
              t('pages.assets.btn_transfer')}</Button>
            </>
          ) : (
            <div>
              <NftList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
