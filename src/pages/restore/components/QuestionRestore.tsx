import { useState, useEffect } from 'react';
import { useGlobalStore, useQuestionStore, useAccountStore } from '@/store';
import toast from 'react-hot-toast';
import { Question } from '@/components/form/Question';
import { QuestionDefault } from '@/components/form/QuestionDefault';
import { useTranslation } from 'react-i18next';

const chineseNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
interface Props {
  onSubmit: (shares: string[]) => void;
  questionList?: any[];
  type: number | string;
}
export const QuestionRestore = ({
  onSubmit,
  questionList,
  type,
}: Props) => {
  const { t } =useTranslation()
  const [kvError, setKvError] = useState<string[]>([]);

  const toastErr = () => {
    for (let j = 0; j < kvError.length; j++) {
      const err = kvError[j];
      if (err) {
        toast.error(err);
        break;
      }
    }
  };
  const validList = (list: any[]) => {
    let validStatus = true;
    for (let i = 0; i < list.length; i++) {
      const question = list[i];
      for (let j = 0; j < question.list.length; j++) {
        const q = question.list[j];
        if (!q.a) {
          toast.error(`问题${chineseNumMap[i]}的第${j + 1}个子问题答案未输入`);
          validStatus = false;
          break;
        }
      }
      if (!validStatus) break;
    }
    if (list.length < 1) {
      toast.error(`最少填写一个问题`);
      validStatus = false;
    }
  };
  const submitHandler = async (_list: any[]) => {
    let filterAnswer = [];
    console.log(_list)
    if (type === 1) {
      const list = _list.map((v, i) => {
        return {
          id: i,
          list: v.list.filter((s: any) => s.a),
          title: v.title,
        };
      });
      filterAnswer = list.filter((v) => v.list.length);
    } else {
      filterAnswer = _list.filter((v) =>
        v.list.every(
          (v: any) => v.a !== undefined && v.a !== null && v.a !== '',
        ),
      );
    }
    if (!filterAnswer.length) {
      toast.error(t('pages.restore.question.toast.error_1'));
      return;
    }
    await restoreEntropy(_list);
  };
  const restoreEntropy = async (shares: string[]) => {
    await onSubmit(shares);
  };
  return (
    <div className='pt-2'>
      
      {type == 1 ? (
        <QuestionDefault
          onSubmit={submitHandler}
          initList={questionList}
          type='restore'
          className='mb-8'
          buttonText={t('pages.restore.btn_restore')}></QuestionDefault>
      ) : (
        <Question
          onSubmit={submitHandler}
          initList={questionList}
          type='restore'
          className='mb-8'
          buttonText={t('pages.restore.btn_restore')}></Question>
      )}
    </div>
  );
};
