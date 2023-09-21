import { RouteObject } from 'react-router-dom';
import AssetsNftAdd from '@/pages/assets/nft/add';
import AssetsNftDetail from '@/pages/assets/nft/detail';
import AssetsTokenTransfer from '@/pages/assets/token/transfer';
import AssetsTokenDetail from '@/pages/assets/token/detail';
import AssetsTokenReceiver from '@/pages/assets/token/receiver';
import AssetsTokenTx from '@/pages/assets/token/tx';
import AssetsNftTransfer from '@/pages/assets/nft/transfer';
import AssetsContact from '@/pages/assets/contact';

export const ROUTE_PATH_ASSETS = {
  ASSETS_NFT_ADD: '/assets/nft/add',
  ASSETS_NFT_DETAIL: '/assets/nft/detail',
  ASSETS_NFT_TRANSFER: '/assets/nft/transfer',
  ASSETS_TOKEN_TRANSFER: '/assets/token/transfer',
  ASSETS_TOKEN_DETAIL: '/assets/token/detail',
  ASSETS_TOKEN_RECEIVER: '/assets/token/receiver',
  ASSETS_TOKEN_TX: '/assets/token/tx',
  ASSETS_CONTACT: '/assets/contact',
};

export const assetsRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH_ASSETS.ASSETS_CONTACT,
    element: <AssetsContact />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_NFT_ADD,
    element: <AssetsNftAdd />,
  },

  {
    path: ROUTE_PATH_ASSETS.ASSETS_NFT_DETAIL,
    element: <AssetsNftDetail />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_NFT_TRANSFER,
    element: <AssetsNftTransfer />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_TRANSFER,
    element: <AssetsTokenTransfer />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_DETAIL,
    element: <AssetsTokenDetail />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_RECEIVER,
    element: <AssetsTokenReceiver />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_TX,
    element: <AssetsTokenTx />,
  },
];
