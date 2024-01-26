import { RouteObject } from 'react-router-dom';
import AssetsNftAdd from '@/pages/assets/nft/add';
import AssetsNftDetail from '@/pages/assets/nft/detail';
import AssetsTokenTransfer from '@/pages/assets/token/transfer';
import AssetsTokenDetail from '@/pages/assets/token/detail';
import AssetsTokenReceiver from '@/pages/assets/token/receiver';
import AssetsTokenTx from '@/pages/assets/token/tx';
import AssetsNftTransfer from '@/pages/assets/nft/transfer';
import AssetsContact from '@/pages/assets/contact';
import AddWalletMethod from '@/pages/assets/token/addWalletMethod';
import AddWalletDetails from '@/pages/assets/token/addWalletDetails';
import ImportWalletDetails from '@/pages/assets/token/importWalletDetails';
import SelectNet from '@/pages/assets/token/selectNetMethod';
import ManageWallet from '@/pages/assets/token/manageWallet';
import EditWalletName from '@/pages/assets/token/editWalletName';
import WalletDetails from '@/pages/assets/token/walletDetails';
import WalletTxDetail from '@/pages/assets/token/walletTx';
import SwitchAddressType from '@/pages/assets/token/switchAddressType';
import WalletReceiver from '@/pages/assets/token/walletReceiver';
import WalletSend from '@/pages/assets/token/walletSend';
import WalletPhrase from '@/pages/assets/token/walletPhrase';
import WalletPhraseVerify from '@/pages/assets/token/walletPhraseVerify';
import WalletPhraseVerifySuccess from '@/pages/assets/token/walletPhraseVerifySuccess';

export const ROUTE_PATH_ASSETS = {
  ASSETS_NFT_ADD: '/assets/nft/add',
  ASSETS_NFT_DETAIL: '/assets/nft/detail',
  ASSETS_NFT_TRANSFER: '/assets/nft/transfer',
  ASSETS_TOKEN_TRANSFER: '/assets/token/transfer',
  ASSETS_TOKEN_DETAIL: '/assets/token/detail',
  ASSETS_TOKEN_RECEIVER: '/assets/token/receiver',
  ASSETS_TOKEN_TX: '/assets/token/tx',
  ASSETS_CONTACT: '/assets/contact',
  ASSETS_TOKEN_ADD_WALLET_METHOD: '/assets/token/addWalletMethod',
  ASSETS_TOKEN_SELECT_WALLET_NET: '/assets/token/selectNetMethod',
  ASSETS_TOKEN_ADD_WALLET_DETAILS: '/assets/token/addWalletDetails',
  ASSETS_TOKEN_IMPORT_WALLET_DETAILS: '/assets/token/importWalletDetails',
  ASSETS_TOKEN_MANAGE_WALLET: '/assets/token/manageWallet',
  ASSETS_TOKEN_EDIT_WALLET_NAME: '/assets/token/editWalletName',
  ASSETS_TOKEN_WALLET_DETAILS: '/assets/token/walletDetails',
  ASSETS_TOKEN_WALLET_TX: '/assets/token/walletTx',
  ASSETS_TOKEN_SWITCH_ADDRESS_TYPE: '/assets/token/switchAddressType',
  ASSETS_TOKEN_WALLET_RECEIVER: '/assets/token/walletReceiver',
  ASSETS_TOKEN_WALLET_SEND: '/assets/token/walletSend',
  ASSETS_TOKEN_WALLET_PHRASE: '/assets/token/walletPhrase',
  ASSETS_TOKEN_WALLET_PHRASE_VERIFY: '/assets/token/walletPhraseVerify',
  ASSETS_TOKEN_WALLET_PHRASE_VERIFY_SUCCESS: '/assets/token/walletPhraseVerifySuccess',
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
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_ADD_WALLET_METHOD,
    element: <AddWalletMethod />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_SELECT_WALLET_NET,
    element: <SelectNet />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_ADD_WALLET_DETAILS,
    element: <AddWalletDetails />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_IMPORT_WALLET_DETAILS,
    element: <ImportWalletDetails />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_MANAGE_WALLET,
    element: <ManageWallet />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_EDIT_WALLET_NAME,
    element: <EditWalletName />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_WALLET_DETAILS,
    element: <WalletDetails />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_WALLET_TX,
    element: <WalletTxDetail />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_SWITCH_ADDRESS_TYPE,
    element: <SwitchAddressType />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_WALLET_RECEIVER,
    element: <WalletReceiver />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_WALLET_SEND,
    element: <WalletSend />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_WALLET_PHRASE,
    element: <WalletPhrase />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_WALLET_PHRASE_VERIFY,
    element: <WalletPhraseVerify />,
  },
  {
    path: ROUTE_PATH_ASSETS.ASSETS_TOKEN_WALLET_PHRASE_VERIFY_SUCCESS,
    element: <WalletPhraseVerifySuccess />,
  }
];
