import { RouteObject } from 'react-router-dom';

import SpaceAuthenticator from '@/pages/space/authenticator';
import SpaceAuthenticatorAdd from '@/pages/space/authenticator/add';
import SpaceAuthenticatorCreate from '@/pages/space/authenticator/create';
import NoteEdit from '@/pages/space/note/edit';
import Note from '@/pages/space/note/list';
import PasswordList from '@/pages/space/password/list';
import PasswordAdd from '@/pages/space/password/add';
import Album from '@/pages/space/album/list';
import FileIndex from '@/pages/space/file/list';

import NetworIndex from '@/pages/space/network/index';
import NetworkList from '@/pages/space/network/list';
import NetworkDetail from '@/pages/space/network/detail';

import GunList from '@/pages/space/gun/list';
import GunApply from '@/pages/space/gun/apply';
import GunDetail from '@/pages/space/gun/detail';
import GunRenew from '@/pages/space/gun/renew';
import GunSearch from '@/pages/space/gun/search';

export const ROUTE_PATH_SPACE = {
  NOTE: '/space/note',
  NOTE_EDIT: '/space/note/:id',
  
  SPACE_AUTHENTICATOR: '/space/authenticator',
  SPACE_AUTHENTICATOR_ADD: '/space/authenticator/add',
  SPACE_AUTHENTICATOR_CREATE: '/space/authenticator/create',
  SPACE_PASSWORD: '/space/password',
  SPACE_PASSWORD_ADD: '/space/password/add',
  SPACE_ALBUM: '/space/album',
  SPACE_FILE: '/space/file',
  SPACE_GUN_LIST: '/space/gun/list',
  SPACE_GUN_APPLY: '/space/gun/apply',
  SPACE_GUN_DETAIL: '/space/gun/detail/:name',
  SPACE_GUN_RENEW: '/space/gun/renew/:name',
  SPACE_GUN_SEARCH: '/space/gun/search/:name',
  SPACE_NETWORK: '/space/network',
  SPACE_NETWORK_LIST: '/space/network/list',
  SPACE_NETWORK_DETAIL: '/space/network/detail',
};

export const spaceRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH_SPACE.NOTE,
    element: <Note />,
  },
  {
    path: ROUTE_PATH_SPACE.NOTE_EDIT,
    element: <NoteEdit />,
  },
  
  {
    path: ROUTE_PATH_SPACE.SPACE_AUTHENTICATOR,
    element: <SpaceAuthenticator />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_AUTHENTICATOR_ADD,
    element: <SpaceAuthenticatorAdd />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_AUTHENTICATOR_CREATE,
    element: <SpaceAuthenticatorCreate />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_PASSWORD,
    element: <PasswordList />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_PASSWORD_ADD,
    element: <PasswordAdd />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_ALBUM,
    element: <Album />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_FILE,
    element: <FileIndex />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_GUN_LIST,
    element: <GunList />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_GUN_APPLY,
    element: <GunApply />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_GUN_DETAIL,
    element: <GunDetail/>,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_GUN_SEARCH,
    element: <GunSearch />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_GUN_RENEW,
    element: <GunRenew />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_NETWORK,
    element: <NetworIndex />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_NETWORK_LIST,
    element: <NetworkList />,
  },
  {
    path: ROUTE_PATH_SPACE.SPACE_NETWORK_DETAIL,
    element: <NetworkDetail />,
  },
  
];
