import { RouteObject } from 'react-router-dom';
import AssetsNftAdd from '@/pages/assets/nft/add';
import AssetsNftDetail from '@/pages/assets/nft/detail';

export const ROUTE_PATH_ASSETS = {
  ASSETS_NFT_ADD: '/assets/nft/add',
  ASSETS_NFT_DETAIL: '/assets/nft/detail',
};

export const assetsRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH_ASSETS.ASSETS_NFT_ADD,
    element: <AssetsNftAdd />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_NFT_DETAIL,
    element: <AssetsNftDetail />,
  },
];
