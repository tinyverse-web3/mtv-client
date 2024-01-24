import { useEffect, useMemo, useState } from 'react';
import { useAccountStore } from '@/store';
import { ButtonTabs } from '@/components/ButtonTabs';
import { usePoint } from '@/lib/hooks';
import { AssetsTokenItem } from './components/AssetsTokenItem';
import { NftList } from './components/NftList';
import { Icon } from '@iconify/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import BottomDrawerMenu from './components/BottomDrawerMenu';
import { useTranslation } from 'react-i18next';
import { useWalletStore } from '@/store';
import IconBtc from "@/assets/images/wallet/icon-btc.png";
import IconEth from "@/assets/images/wallet/icon-eth.png";


export default function AssetsIndex() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const type = params.get('type');
  const [assetsType, setAssetsType] = useState(type || 'token');
  // const { balance: pointBalance } = usePoint();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { list, remove, getList } = useWalletStore((state) => state);


  const assetsTypes = [
    {
      label: t('pages.assets.token.wallet_title'),
      value: 'token',
    },
    {
      label: t('pages.assets.nft.title'),
      value: 'nft',
    },
  ];
  const toAdd = () => {
    nav(ROUTE_PATH.ASSETS_NFT_ADD);
  };

  const toTokenDetail = (type: string) => {
    switch (type) {
      case 'Tinyverse':
        nav(ROUTE_PATH.ASSETS_TOKEN_DETAIL);
      case 'Bitcoin':
        //nav();
      case 'Ethereum':
        //nav();
    }
   
  };
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const toAddWalletMethod = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_ADD_WALLET_METHOD + '?opType=add');
  };

  const toManageWallet = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_MANAGE_WALLET);
  };

  // useEffect(() => {
  //   setAssetsType(type || 'token');
  // }, [params]);



  const getWalletList = async () => {
    if (!list?.length) {
      setLoading(true);
    }
    await getList();
    setLoading(false);
  };
  useEffect(() => {
    getWalletList();
  }, []);

  const getIconByType = (type: string) => {
   switch (type) {
     case 'Tinyverse':
       return '/logo.png';
     case 'Bitcoin':
       return IconBtc;
     case 'Ethereum':
       return IconEth;
   }
  }
  
  return (
    <div>
      <div className='p-4'>
        <div className='flex justify-between mb-4'>
          <ButtonTabs list={assetsTypes} value={assetsType} onChange={setAssetsType} />
          {assetsType === 'nft' && (
            <Icon
              icon='mdi:plus-circle-outline'
              onClick={toAdd}
              className=' text-xl'></Icon>
          )}
          {assetsType === 'token' && (
            <div className='flex' >
             <Icon
             icon='mdi:plus-circle-outline'
             //onClick={openDrawer}
             onClick={toAddWalletMethod}
             className='text-xl mr-4'></Icon>
            <Icon
              icon='mdi:cog-outline'
              onClick={toManageWallet}
              className='text-xl'></Icon>
            </div>
          )}
        </div>

        <div>
          {assetsType === 'token' ? (
            <>
              {/* <BottomDrawerMenu isOpen={isDrawerOpen} onClose={closeDrawer} />  */}
              <div className='mb-20'>
                {/* <AssetsTokenItem
                  icon='/logo.png'
                  chain='Tinyverse'
                  symbol={t('pages.assets.token.point_name')}
                  key='point'
                  onClick={() => toTokenDetail()}
                  balance={pointBalance}
                /> */}
                 {list.map((item) => (
                  <AssetsTokenItem
                    icon={getIconByType(item.Type)}
                    chain={item.Type}
                    symbol={item.Name}
                    key={item.Address}
                    balance={item.Balance}
                    dollar={item.BalanceDollar}
                    onClick={() => toTokenDetail(item.Type)}
                  />
                ))}
              </div>
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
