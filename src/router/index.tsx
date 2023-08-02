import {
  createBrowserRouter,
  createHashRouter,
  RouteObject,
} from 'react-router-dom';
import Root from '@/Root';

import ChatImChare from '@/pages/chat/imshare';
import ChatList from '@/pages/chat/list';
import ChatMessage from '@/pages/chat/message';
import ChatProfile from '@/pages/chat/profile';
import Home from '@/pages/home';
import Index from '@/pages/index';
import AssetsIndex from '@/pages/assets';
import AssetsNftAdd from '@/pages/assets/nft/add';
import SpaceIndex from '@/pages/space';

import Restore from '@/pages/restore';
import RestorePhrase from '@/pages/restore/phrase';
import RestorePhraseFeature from '@/pages/restore/phraseFeature';
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

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  INDEX: '/index',
  HOME: '/home',
  SPACE_INDEX: '/home/space',
  CHAT_INDEX: '/home/chat',
  ASSETS_INDEX: '/home/assets',
  ASSETS_NFT_ADD: '/assets/nft/add',
  CREATE: '/create',
  RESTORE: '/restore',
  RESTORE_PHRASE: '/restore/phrase',
  RESTORE_PHRASE_FEATURE: '/restore/phraseFeature',
  RESTORE_PROTECTOR: '/restore/protector',
  RESTORE_VERIFY: '/restore/verify',
  RESTORE_QUESTION: '/restore/question',
  RESTORE_PRIVATEDATA: '/restore/privateData',
  RESTORE_QUESTION_FEATURE: '/restore/questionFeature',

  UNLOCK: '/unlock',
  RETRIEVE: '/retrieve',

  TEST: '/test',
  APP_TEST: '/app',
  CHAT_MESSAGE: '/chat/message',
  CHAT_PROFILE: '/chat/profile',
  CHAT_SHARE: '/chat/imShare',
  ...ROUTE_PATH_SPACE,
  ...ROUTE_PATH_ACCOUNT,
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
        children: [
          {
            path: ROUTE_PATH.CHAT_INDEX,
            element: <ChatList />,
          },
          {
            path: ROUTE_PATH.SPACE_INDEX,
            element: <SpaceIndex />,
          },
          {
            path: ROUTE_PATH.ASSETS_INDEX,
            element: <AssetsIndex />,
          },
        ],
      },
      {
        path: ROUTE_PATH.APP_TEST,
        element: <AppTest />,
      },
      {
        path: ROUTE_PATH.ASSETS_NFT_ADD,
        element: <AssetsNftAdd />,
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
        path: ROUTE_PATH.RESTORE_PHRASE_FEATURE,
        element: <RestorePhraseFeature />,
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

      // {
      //   path: ROUTE_PATH.CHAT_INDEX,
      //   element: <ChatList />,
      // },
      {
        path: ROUTE_PATH.CHAT_MESSAGE,
        element: <ChatMessage />,
      },
      {
        path: ROUTE_PATH.CHAT_PROFILE,
        element: <ChatProfile />,
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
    ],
  },
];

export const router = createHashRouter(routes);
