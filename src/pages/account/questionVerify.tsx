import { useQuestionStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { Question } from '@/components/question/Question';
import { ROUTE_PATH } from '@/router';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuestionVerify() {
  const nav = useNavigate();
  const initList = useQuestionStore((state) => state.list);

  const verify = (list: any[]) => {
    let status = true;
    for (let i = 0; i < list.length; i++) {
      const { q, a } = list[i];
      const item = initList.find((v) => v.content === q && a === v.a);
      if (!item) {
        status = false;
        break;
      }
    }
    return status;
  };
  const onSubmit = async (_list: any[]) => {
    // setQuestionList(_list);
    console.log(_list);
    const status = verify(_list);
    nav(ROUTE_PATH.ACCOUNT_QUESTION_RESULT, { state: status });
  };
  useEffect(() => {
    if (!initList.length) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  }, []);
  return (
    <LayoutThird title='智能隐私恢复测试' path={ROUTE_PATH.ACCOUNT_QUESTION}>
      <div className='p-4'>
        <Question
          initList={initList}
          type='verify'
          buttonText='恢复测试'
          onSubmit={onSubmit}></Question>
      </div>
    </LayoutThird>
  );
}
