import { createBrowserRouter, redirect } from 'react-router-dom';
import Index from '@/pages/index';
import Create from '@/pages/create';
import Restore from '@/pages/restore';
import Unlock from '@/pages/unlock';
import Home from '@/pages/home';
import Account from '@/pages/account';
import Note from '@/pages/note/list';
import NoteEdit from '@/pages/note/edit';
import ChatList from '@/pages/chat/list';
import ChatMessage from '@/pages/chat/message';
import Test from '@/pages/test';

export const ROUTE_PATH = {
  INDEX: '/',
  HOME: '/home',
  CREATE: '/create',
  ACCOUNT: '/account',
  RESTORE: '/restore',
  UNLOCK: '/unlock',
  NOTE: '/note',
  TEST: '/test',
  NOTE_EDIT: '/note/:id',
  CHAT_LIST: '/chat/list',
  CHAT_MESSAGE: '/chat/message',
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
    path: ROUTE_PATH.TEST,
    element: <Test />,
  },
  
]);
