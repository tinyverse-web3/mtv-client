import { RouteObject } from 'react-router-dom';
import AccountName from '@/pages/account/username';
import AccountQrcode from '@/pages/account/qrcode';
import AccountMyPublicKey from '@/pages/account/myPublicKey';
import AccountScan from '@/pages/account/scan';
import AccountPhrase from '@/pages/account/phrase';
import AccountPhraseVerify from '@/pages/account/phraseVerify';
import AccountPhraseSuccess from '@/pages/account/phraseVerifySuccess';
import AccountQuestion from '@/pages/account/question';
import AccountQuestionVerify from '@/pages/account/questionVerify';
import AccountQuestionVerifyResult from '@/pages/account/questionVerifyResult';
import AccountProtector from '@/pages/account/protector';
import AccountProtectorVerify from '@/pages/account/protectorVerify';
import AccountProtectorAdd from '@/pages/account/protectorAdd';
import PrivateData from '@/pages/account/privateData';
import Account from '@/pages/account/';
import ChangePwd from '@/pages/account/changePwd';

export const ROUTE_PATH_ACCOUNT = {
  ACCOUNT: '/account',
  ACCOUNT_NAME: '/account/name',
  ACCOUNT_CHANGE_PWD: '/account/changePwd',
  ACCOUNT_QRCODE: '/account/qrcode',
  ACCOUNT_PUBLICKEY: '/account/publickey',
  ACCOUNT_SCAN: '/account/scan',
  ACCOUNT_PHRASE: '/account/phrase',
  ACCOUNT_PHRASE_VERIFY: '/account/phrase/verify',
  ACCOUNT_VERIFY_SUCCESS: '/account/phrase/success',
  ACCOUNT_QUESTION: '/account/question',
  ACCOUNT_QUESTION_VERIFY: '/account/question/verify',
  ACCOUNT_QUESTION_RESULT: '/account/question/result',
  ACCOUNT_PROTECTOR: '/account/protector',
  ACCOUNT_PROTECTOR_ADD: '/account/protector/add',
  ACCOUNT_PROTECTOR_VERIFY: '/account/protector/verify',
  ACCOUNT_PRIVATEDATA: '/account/privateData',
};
export const accountRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT,
    element: <Account />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_CHANGE_PWD,
    element: <ChangePwd />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PRIVATEDATA,
    element: <PrivateData />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_NAME,
    element: <AccountName />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_QRCODE,
    element: <AccountQrcode />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PUBLICKEY,
    element: <AccountMyPublicKey />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_SCAN,
    element: <AccountScan />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PHRASE,
    element: <AccountPhrase />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PHRASE_VERIFY,
    element: <AccountPhraseVerify />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_VERIFY_SUCCESS,
    element: <AccountPhraseSuccess />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_QUESTION,
    element: <AccountQuestion />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_QUESTION_VERIFY,
    element: <AccountQuestionVerify />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_QUESTION_RESULT,
    element: <AccountQuestionVerifyResult />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PROTECTOR,
    element: <AccountProtector />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PROTECTOR_ADD,
    element: <AccountProtectorAdd />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PROTECTOR_VERIFY,
    element: <AccountProtectorVerify />,
  },
];
