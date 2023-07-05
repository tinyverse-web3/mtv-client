import { useNavigate } from 'react-router-dom';
import {
  useQuestionStore,
  useAccountStore,
} from '@/store';
import { QuestionRestore } from '@/pages/restore/components/QuestionRestore';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';

export default function Restore() {
  const nav = useNavigate();
  const { account, getLocalAccountInfo } = useAccountStore((state) => state);
  const {
    list: questionList,
    sssData: serverShare,
    type,
  } = useQuestionStore((state) => state);

  const questionSubmit = async (list: any[]) => {
    const result = await account.restoreByQuestions(list, type);
    await getLocalAccountInfo();
    nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
  };
  return (
    <LayoutThird title='智能隐私恢复'>
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
