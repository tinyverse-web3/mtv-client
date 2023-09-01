import { useNavigate } from 'react-router-dom';
import {
  useQuestionStore,
  useAccountStore,
  useGlobalStore,
  useRestoreStore,
} from '@/store';
import { QuestionRestore } from '@/pages/restore/components/QuestionRestore';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Restore() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { getLocalAccountInfo } = useAccountStore((state) => state);
  const { setLockStatus } = useGlobalStore((state) => state);
  const {
    list: questionList,
    sssData: serverShare,
    type,
  } = useQuestionStore((state) => state);
  const { passwordPrivateData, textPrivateData, customPrivateData } = useRestoreStore(
    (state) => state,
  );
  const questionSubmit = async (list: any[]) => {
    const { code, msg } = await account.restoreByQuestions({
      list,
      type,
      passwordPrivateData,
      textPrivateData,
      CustomPrivateData: customPrivateData,
    });
    if (code === '000000') {
      await getLocalAccountInfo();
      nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      toast.success(t('pages.restore.toast.restore_success'));
    } else {
      toast.error(msg);
    }
    setLockStatus(false);
  };
  return (
    
    <LayoutThird title={t('pages.restore.question.title')}>
      <div className='p-6'>
        <QuestionRestore
          type={type}
          serverShare={serverShare}
          questionList={questionList}
          onSubmit={questionSubmit}></QuestionRestore>
      </div>
    </LayoutThird>
  );
}
