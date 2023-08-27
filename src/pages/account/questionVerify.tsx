import { useQuestionStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { Question } from '@/components/form/Question';
import { QuestionDefault } from '@/components/form/QuestionDefault';
import { ROUTE_PATH } from '@/router';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function QuestionVerify() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { list: initList, type } = useQuestionStore((state) => state);

  const verify = (list: any[]) => {
    let status = true;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      for (let j = 0; j < item.list.length; j++) {
        const { a } = item.list[j];
        if (initList[i].list[j].a !== a) {
          status = false;
          break;
        }
      }
      if (!status) {
        break;
      }
    }
    return status;
  };
  const onSubmit = async (_list: any[]) => {
    const status = verify(_list);
    nav(ROUTE_PATH.ACCOUNT_QUESTION_RESULT, { state: status });
  };
  useEffect(() => {
    if (!initList.length) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  }, []);
  return (
    <LayoutThird title={t('pages.account.question.test_title')}>
      <div className='p-4'>
        {type == 1 ? (
          <QuestionDefault
            type='verify'
            buttonText={t('pages.account.question.test_text')}
            initList={initList}
            onSubmit={onSubmit}></QuestionDefault>
        ) : (
          <Question
            initList={initList}
            type='verify'
            buttonText={t('pages.account.question.test_text')}
            onSubmit={onSubmit}></Question>
        )}
      </div>
    </LayoutThird>
  );
}
