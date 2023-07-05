import {
  createBrowserRouter,
  createHashRouter,
  RouteObject,
} from 'react-router-dom';
import Root from '@/Root';

import ChatImChare from '@/pages/chat/imshare';
import ChatList from '@/pages/chat/list';
import ChatMessage from '@/pages/chat/message';
import Home from '@/pages/home';
import Index from '@/pages/index';
import AssetsIndex from '@/pages/assets';

import Restore from '@/pages/restore';
import RestorePhrase from '@/pages/restore/phrase';
import RestoreProtector from '@/pages/restore/protector';
import RestoreVerify from '@/pages/restore/verify';
import RestoreQuestion from '@/pages/restore/question';
import RestorePirvateData from '@/pages/restore/privateData';
import RestoreQuestionFeature from '@/pages/restore/questionFeature';
import Test from '@/pages/test';
import AppTest from '@/pages/app';
import Unlock from '@/pages/unlock';

import Retrieve from '@/pages/retrieve';

import { spaceRoutes, ROUTE_PATH_SPACE } from './space';
import { accountRoutes, ROUTE_PATH_ACCOUNT } from './account';
import GunListPage from '@/pages/gun/gunlistpage';
import GunApplyPage from '@/pages/gun/gunapplypage';
import GunDetailsPage from '@/pages/gun/gundetailspage';
import GunRenewPage from '@/pages/gun/gunrenewpage';
import GunSearchPage from '@/pages/gun/gunsearchpage';
const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  INDEX: '/index',
  HOME: '/home',
  CREATE: '/create',

  RESTORE: '/restore',
  RESTORE_PHRASE: '/restore/phrase',
  RESTORE_PROTECTOR: '/restore/protector',
  RESTORE_VERIFY: '/restore/verify',
  RESTORE_QUESTION: '/restore/question',
  RESTORE_PRIVATEDATA: '/restore/privateData',
  RESTORE_QUESTION_FEATURE: '/restore/questionFeature',
  ASSETS_INDEX: '/assets',
  UNLOCK: '/unlock',
  RETRIEVE: '/retrieve',

  TEST: '/test',
  APP_TEST: '/app',

  CHAT_LIST: '/chat/list',
  CHAT_MESSAGE: '/chat/message',

  CHAT_SHARE: '/chat/imShare',
  ...ROUTE_PATH_SPACE,
  ...ROUTE_PATH_ACCOUNT,
  GUN_GUNLISTPAGE: '/gun/gunlistpage',
  GUN_GUNAPPLYPAGE: '/gun/gunapplypage',
  GUN_DETAILSPAGE: '/gun/get/:name',
  GUN_RENEWPAGE: '/gun/renew/:name',
  GUN_SEARCHPAGE: '/gun/search/:name',

};
const hashPath: any = {};
Object.keys(ROUTE_PATH).forEach((k: any) => {
  hashPath[k] = resolveHashPath((ROUTE_PATH as any)[k]);
});

export const ROUTE_HASH_PATH: typeof ROUTE_PATH = hashPath;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATH.INDEX,
        element: <Index />,
      },
      {
        path: ROUTE_PATH.HOME,
        element: <Home />,
      },
      {
        path: ROUTE_PATH.APP_TEST,
        element: <AppTest />,
      },

      {
        path: ROUTE_PATH.RESTORE,
        element: <Restore />,
      },
      {
        path: ROUTE_PATH.RESTORE_PHRASE,
        element: <RestorePhrase />,
      },
      {
        path: ROUTE_PATH.RESTORE_PROTECTOR,
        element: <RestoreProtector />,
      },
      {
        path: ROUTE_PATH.RESTORE_VERIFY,
        element: <RestoreVerify />,
      },
      {
        path: ROUTE_PATH.RESTORE_QUESTION,
        element: <RestoreQuestion />,
      },
      {
        path: ROUTE_PATH.RESTORE_PRIVATEDATA,
        element: <RestorePirvateData />,
      },
      {
        path: ROUTE_PATH.RESTORE_QUESTION_FEATURE,
        element: <RestoreQuestionFeature />,
      },
      {
        path: ROUTE_PATH.UNLOCK,
        element: <Unlock />,
      },
      {
        path: ROUTE_PATH.RETRIEVE,
        element: <Retrieve />,
      },

      {
        path: ROUTE_PATH.ASSETS_INDEX,
        element: <AssetsIndex />,
      },

      {
        path: ROUTE_PATH.CHAT_LIST,
        element: <ChatList />,
      },
      {
        path: ROUTE_PATH.CHAT_MESSAGE,
        element: <ChatMessage />,
      },
      {
        path: ROUTE_PATH.CHAT_SHARE,
        element: <ChatImChare />,
      },
      {
        path: ROUTE_PATH.TEST,
        element: <Test />,
      },
      ...spaceRoutes,
      ...accountRoutes,
      {
        path: ROUTE_PATH.GUN_GUNLISTPAGE,
        element: <GunListPage />,
      },
      {
        path: ROUTE_PATH.GUN_GUNAPPLYPAGE,
        element: <GunApplyPage />,
      },
      {
        path: ROUTE_PATH.GUN_DETAILSPAGE,
        element: <GunDetailsPage />,
      },
      {
        path: ROUTE_PATH.GUN_RENEWPAGE,
        element: <GunRenewPage />,
      },
      {
        path: ROUTE_PATH.GUN_SEARCHPAGE,
        element: <GunSearchPage />,
      },
    ],
  },
];

export const router = createHashRouter(routes);
