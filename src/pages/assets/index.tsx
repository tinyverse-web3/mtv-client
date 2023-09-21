import { useMemo, useState } from 'react';
import { useAccountStore } from '@/store';
import { ButtonTabs } from '@/components/ButtonTabs';
import { usePoint } from '@/lib/hooks';
import { AssetsTokenItem } from './components/AssetsTokenItem';
import { NftList } from './components/NftList';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

export default function AssetsIndex() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [assetsType, setAssetsType] = useState('token');
  const { balance: pointBalance } = usePoint();
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

  const toTokenDetail = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_DETAIL);
  };
  return (
    <div>
      <div className='p-4'>
        <div className='flex justify-between mb-4'>
          <ButtonTabs list={assetsTypes} onChange={setAssetsType} />
          {assetsType === 'NFT' && (
            <Icon
              icon='mdi:plus-circle-outline'
              onClick={toAdd}
              className=' text-xl'></Icon>
          )}
        </div>

        <div>
          {assetsType === 'token' ? (
            <>
              <div className='mb-20'>
                <AssetsTokenItem
                  icon='/logo.png'
                  chain='Tinyverse'
                  symbol={t('pages.assets.token.point_name')}
                  key='point'
                  onClick={() => toTokenDetail()}
                  balance={pointBalance}
                />
                {/* {list.map((item) => (
                  <AssetsTokenItem
                    icon={item.icon}
                    symbol={item.symbol}
                    key={item.symbol}
                    balance={item.balance}
                    dollar={item.dollar}
                  />
                ))} */}
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
