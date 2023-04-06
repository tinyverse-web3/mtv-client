import { createBrowserRouter, createHashRouter, RouteObject } from 'react-router-dom';
import Account from '@/pages/account/';
import ChangePwd from '@/pages/account/changePwd';
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
import AccountName from '@/pages/account/username';
import AccountQrcode from '@/pages/account/qrcode';
import AccountPhrase from '@/pages/account/phrase';
import AccountPhraseVerify from '@/pages/account/phraseVerify';
import AccountPhraseSuccess from '@/pages/account/phraseVerifySuccess';
import AccountQuestion from '@/pages/account/question';
import AccountQuestionVerify from '@/pages/account/questionVerify';
import AccountQuestionVerifyResult from '@/pages/account/questionVerifyResult';
import AccountProtector from '@/pages/account/protector';
import AccountProtectorVerify from '@/pages/account/protectorVerify';
import AccountProtectorAdd from '@/pages/account/protectorAdd';
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
  ACCOUNT_NAME: '/account/Accountname',
  ACCOUNT_QRCODE: '/account/qrcode',
  ACCOUNT_PHRASE: '/account/phrase',
  ACCOUNT_PHRASE_VERIFY: '/account/phrase/verify',
  ACCOUNT_VERIFY_SUCCESS: '/account/phrase/success',
  ACCOUNT_QUESTION: '/account/question',
  ACCOUNT_QUESTION_VERIFY: '/account/question/verify',
  ACCOUNT_QUESTION_RESULT: '/account/question/result',
  ACCOUNT_PROTECTOR: '/account/protector',
  ACCOUNT_PROTECTOR_ADD: '/account/protector/add',
  ACCOUNT_PROTECTOR_VERIFY: '/account/protector/verify',
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
    path: ROUTE_PATH.ACCOUNT_NAME,
    element: <AccountName />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_QRCODE,
    element: <AccountQrcode />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_PHRASE,
    element: <AccountPhrase />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_PHRASE_VERIFY,
    element: <AccountPhraseVerify />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_VERIFY_SUCCESS,
    element: <AccountPhraseSuccess />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_QUESTION,
    element: <AccountQuestion />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_QUESTION_VERIFY,
    element: <AccountQuestionVerify />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_QUESTION_RESULT,
    element: <AccountQuestionVerifyResult />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_PROTECTOR,
    element: <AccountProtector />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_PROTECTOR_ADD,
    element: <AccountProtectorAdd />,
  },
  {
    path: ROUTE_PATH.ACCOUNT_PROTECTOR_VERIFY,
    element: <AccountProtectorVerify />,
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
