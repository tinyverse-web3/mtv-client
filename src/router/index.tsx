import Account from '@/pages/account';
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
import Test from '@/pages/test';
import Unlock from '@/pages/unlock';
import Userinfo from '@/pages/userinfo';
import { createBrowserRouter } from 'react-router-dom';

export const ROUTE_PATH = {
  INDEX: '/',
  HOME: '/home',
  CREATE: '/create',
  ACCOUNT: '/account',
  CHANGE_PWD: '/changePwd',
  RESTORE: '/restore',
  UNLOCK: '/unlock',
  NOTE: '/note',
  TEST: '/test',
  NOTE_EDIT: '/note/:id',
  CHAT_LIST: '/chat/list',
  CHAT_MESSAGE: '/chat/message',
  CHAT_SHARE: '/chat/imShare'
  USERINFO: '/chat/Userinfo',
}
export const router = createBrowserRouter([
  {
    path: ROUTE_PATH.INDEX,
    element: <Index />,
  },
  {
    path: ROUTE_PATH.HOME,
    element: <Home />,
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
    path: ROUTE_PATH.USERINFO,
    element: <Userinfo />,
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
    path: ROUTE_PATH.UNLOCK,
    element: <Unlock />,
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
  
]);
