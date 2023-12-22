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
import SpaceIndex from '@/pages/space';

import Test from '@/pages/test';
import AppTest from '@/pages/app';
import Unlock from '@/pages/unlock';
import Account from '@/pages/account/';
import Retrieve from '@/pages/retrieve';

import { spaceRoutes, ROUTE_PATH_SPACE } from './space';
import { accountRoutes, ROUTE_PATH_ACCOUNT } from './account';
import { assetsRoutes, ROUTE_PATH_ASSETS } from './assets';
import { restoreRoutes, ROUTE_PATH_RESOTRE } from './restore';
import { settingRoutes, ROUTE_PATH_SETTING } from './setting';

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  INDEX: '/index',
  HOME: '/home',
  SPACE_INDEX: '/home/space',
  CHAT_INDEX: '/home/chat',
  ASSETS_INDEX: '/home/assets',
  ACCOUNT: '/home/account',

  CREATE: '/create',

  UNLOCK: '/unlock',
  RETRIEVE: '/retrieve',

  TEST: '/test',
  APP_TEST: '/app',
  CHAT_MESSAGE: '/chat/message',
  CHAT_PROFILE: '/chat/profile',
  CHAT_SHARE: '/chat/imShare',
  ...ROUTE_PATH_SPACE,
  ...ROUTE_PATH_ACCOUNT,
  ...ROUTE_PATH_ASSETS,
  ...ROUTE_PATH_RESOTRE,
  ...ROUTE_PATH_SETTING,
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
          {
            path: ROUTE_PATH.ACCOUNT,
            element: <Account />,
          },
        ],
      },
      {
        path: ROUTE_PATH.APP_TEST,
        element: <AppTest />,
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
        path: ROUTE_PATH.CHAT_INDEX,
        element: <ChatList />,
      },
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
      ...restoreRoutes,
      ...assetsRoutes,
      ...settingRoutes,
    ],
  },
];
export const router = createHashRouter(routes);
