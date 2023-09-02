import { useQuestionStore } from '@/store';
import { Question } from '@/components/form/Question';
import { QuestionDefault } from '@/components/form/QuestionDefault';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
interface Props {
  type: Number;
}
export const QuestionMaintain = ({ type }: Props) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { setList: setQuestionList, setType } = useQuestionStore(
    (state) => state,
  );

  const onSubmit = async (_list: any[]) => {
    // let list = _list.map((v, i) => {
    //   return {
    //     id: i,
    //     list: v.list
    //       .filter((s: any) => s.a),
    //     title: v.title,
    //   };
    // });
    // list = list.filter((v) => v.list.length);
    const list = cloneDeep(_list);
    setQuestionList(list.map((v) => ({ list: v.list, title: v.title })));
    nav(ROUTE_PATH.ACCOUNT_QUESTION_VERIFY);
  };
  return (
    <>
      {type == 1 ? (
        <QuestionDefault
          type='maintain'
          buttonText={t('pages.account.question.test_text')}
          onSubmit={onSubmit}
        />
      ) : (
        <Question
          type='maintain'
          buttonText={t('pages.account.question.test_text')}
          onSubmit={onSubmit}></Question>
      )}
    </>
  );
};
