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
import AccountProtectorAdd from '@/pages/account/protectorAdd';
import AccountAward from '@/pages/account/award';
import PrivateData from '@/pages/account/privateData';
import PrivateDataVerify from '@/pages/account/privateDataVerify';

import ChangePwd from '@/pages/account/changePwd';
import AccountLocalSafe from '@/pages/account/localSafe';
import AccountMultiVerify from '@/pages/account/multiVerify';
import AccountRestory from '@/pages/account/restory';
import Profile from '@/pages/account/profile';
import SubAccountList from '@/pages/account/subAccount/list';
import SubAccountEdit from '@/pages/account/subAccount/edit';
import About from '@/pages/account/about';

export const ROUTE_PATH_ACCOUNT = {
  ACCOUNT_NAME: '/account/name',
  ACCOUNT_CHANGE_PWD: '/account/changePwd',
  ACCOUNT_LOCAL_SAFE: '/account/safe/local',
  ACCOUNT_RESTORY: '/account/safe/restory',
  ACCOUNT_MULTI_VERIFY: '/account/safe/multi',
  ACCOUNT_QRCODE: '/account/qrcode',
  ACCOUNT_PUBLICKEY: '/account/publickey',
  ACCOUNT_SCAN: '/account/scan',
  ACCOUNT_AWARD: '/account/award',
  ACCOUNT_PROFILE: '/account/profile',
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
  ACCOUNT_PRIVATEDATA_VERIFY: '/account/privateData/verify',
  ACCOUNT_SUBACCOUNT_LIST: '/account/subAccount/list',
  ACCOUNT_SUBACCOUNT_EDIT: '/account/subAccount/edit',
  ACCOUNT_ABOUT: '/account/about',
};
export const accountRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_CHANGE_PWD,
    element: <ChangePwd />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_LOCAL_SAFE,
    element: <AccountLocalSafe />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_RESTORY,
    element: <AccountRestory />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_MULTI_VERIFY,
    element: <AccountMultiVerify />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PRIVATEDATA,
    element: <PrivateData />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PRIVATEDATA_VERIFY,
    element: <PrivateDataVerify />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_PROFILE,
    element: <Profile />,
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
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_SUBACCOUNT_LIST,
    element: <SubAccountList />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_SUBACCOUNT_EDIT,
    element: <SubAccountEdit />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_AWARD,
    element: <AccountAward />,
  },
  {
    path: ROUTE_PATH_ACCOUNT.ACCOUNT_ABOUT,
    element: <About />,
  },
];
