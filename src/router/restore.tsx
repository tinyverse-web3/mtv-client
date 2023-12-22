import { RouteObject } from 'react-router-dom';
import Restore from '@/pages/restore';
import RestorePhrase from '@/pages/restore/phrase';
import RestorePhraseFeature from '@/pages/restore/phraseFeature';
import RestoreProtector from '@/pages/restore/protector';
import RestoreVerify from '@/pages/restore/verify';
import RestoreQuestion from '@/pages/restore/question';
import RestorePirvateData from '@/pages/restore/privateData';
import RestoreQuestionFeature from '@/pages/restore/questionFeature';

export const ROUTE_PATH_RESOTRE = {
  RESTORE: '/restore',
  RESTORE_PHRASE: '/restore/phrase',
  RESTORE_PHRASE_FEATURE: '/restore/phraseFeature',
  RESTORE_PROTECTOR: '/restore/protector',
  RESTORE_VERIFY: '/restore/verify',
  RESTORE_QUESTION: '/restore/question',
  RESTORE_PRIVATEDATA: '/restore/privateData',
  RESTORE_QUESTION_FEATURE: '/restore/questionFeature',
};

export const restoreRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH_RESOTRE.RESTORE,
    element: <Restore />,
  },
  {
    path: ROUTE_PATH_RESOTRE.RESTORE_PHRASE,
    element: <RestorePhrase />,
  },
  {
    path: ROUTE_PATH_RESOTRE.RESTORE_PHRASE_FEATURE,
    element: <RestorePhraseFeature />,
  },
  {
    path: ROUTE_PATH_RESOTRE.RESTORE_PROTECTOR,
    element: <RestoreProtector />,
  },
  {
    path: ROUTE_PATH_RESOTRE.RESTORE_VERIFY,
    element: <RestoreVerify />,
  },
  {
    path: ROUTE_PATH_RESOTRE.RESTORE_QUESTION,
    element: <RestoreQuestion />,
  },
  {
    path: ROUTE_PATH_RESOTRE.RESTORE_PRIVATEDATA,
    element: <RestorePirvateData />,
  },
  {
    path: ROUTE_PATH_RESOTRE.RESTORE_QUESTION_FEATURE,
    element: <RestoreQuestionFeature />,
  },
];
