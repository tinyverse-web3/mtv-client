import { createBrowserRouter, createHashRouter, RouteObject } from 'react-router-dom';
import Account from '@/pages/account/';
import ChangePwd from '@/pages/changePwd';
import ChatImChare from '@/pages/chat/imshare';
import ChatList from '@/pages/chat/list';
import ChatMessage from '@/pages/chat/message';
import Create from '@/pages/create';
import Home from '@/pages/home';
import Index from '@/pages/index';
import NoteEdit from '@/pages/note/edit';
import Note from '@/pages/note/list';
import Restore from '@/pages/restore';
import RestorePhrase from '@/pages/restore/phrase';
import Test from '@/pages/test';
import Unlock from '@/pages/unlock';
import UserName from '@/pages/account/username';
import UserQrcode from '@/pages/account/qrcode';
import UserPhrase from '@/pages/account/phrase';
import UserPhraseVerify from '@/pages/account/verifyPhrase';
import UserPhraseSuccess from '@/pages/account/verifyPhraseSuccess';
import SpaceIndex from '@/pages/space';


const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  INDEX: '/',
  HOME: '/home',
  CREATE: '/create',
  CHANGE_PWD: '/changePwd',
  RESTORE: '/restore',
  RESTORE_PHRASE: '/restore/phrase',
  ACCOUNT: '/account',
  USER_NAME: '/account/username',
  USER_QRCODE: '/account/qrcode',
  USER_PHRASE: '/account/phrase',
  USER_PHRASE_VERIFY: '/account/phrase/verify',
  USER_VERIFY_SUCCESS: '/account/phrase/success',
  SPACE_INDEX: '/space',
  UNLOCK: '/unlock',
  NOTE: '/note',
  TEST: '/test',
  NOTE_EDIT: '/note/:id',
  CHAT_LIST: '/chat/list',
  CHAT_MESSAGE: '/chat/message',
  CHAT_SHARE: '/chat/imShare',
};
const hashPath: any = {};
Object.keys(ROUTE_PATH).forEach((k: any) => {
  hashPath[k] = resolveHashPath((ROUTE_PATH as any)[k]);
});
export const ROUTE_HASH_PATH: typeof ROUTE_PATH = hashPath;

export const routes: RouteObject[] = [
  {
    path: ROUTE_PATH.INDEX,
    element: <Index />,
  },
  {
    path: ROUTE_PATH.HOME,
    element: <Home />,
  },

  {
    path: ROUTE_PATH.CREATE,
    element: <Create />,
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
    path: ROUTE_PATH.UNLOCK,
    element: <Unlock />,
  },
  {
    path: ROUTE_PATH.ACCOUNT,
    element: <Account />,
  },
  {
    path: ROUTE_PATH.CHANGE_PWD,
    element: <ChangePwd />,
  },
  {
    path: ROUTE_PATH.USER_NAME,
    element: <UserName />,
  },
  {
    path: ROUTE_PATH.USER_QRCODE,
    element: <UserQrcode />,
  },
  {
    path: ROUTE_PATH.USER_PHRASE,
    element: <UserPhrase />,
  },
  {
    path: ROUTE_PATH.USER_PHRASE_VERIFY,
    element: <UserPhraseVerify />,
  },
  {
    path: ROUTE_PATH.USER_VERIFY_SUCCESS,
    element: <UserPhraseSuccess />,
  },
  {
    path: ROUTE_PATH.SPACE_INDEX,
    element: <SpaceIndex />,
  },
  {
    path: ROUTE_PATH.NOTE,
    element: <Note />,
  },
  {
    path: ROUTE_PATH.NOTE_EDIT,
    element: <NoteEdit />,
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
];
export const router = createHashRouter(routes);
