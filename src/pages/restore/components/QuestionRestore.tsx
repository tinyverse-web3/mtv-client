import { useMemo } from 'react';
import { Loading, Textarea, Row } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { Select } from '@/components/form/Select';
import { useState, useEffect } from 'react';
import { KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useGlobalStore, useQuestionStore } from '@/store';
import toast from 'react-hot-toast';
import { Question } from '@/components/form/Question';
import { QuestionDefault } from '@/components/form/QuestionDefault';

const chineseNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
interface Props {
  onSubmit: (shares: string[]) => void;
  serverShare?: string;
  questionList?: any[];
  type: number | string;
}
export const QuestionRestore = ({
  onSubmit,
  serverShare,
  questionList,
  type,
}: Props) => {
  const [selectValue, setSelectValue] = useState('1');
  const [kvError, setKvError] = useState<string[]>([]);
  const { email } = useQuestionStore((state) => state);
  const userInfo = useGlobalStore((state) => state.userInfo);
  // const [shareA, setShareA] = useState('');
  const [shareB, setShareB] = useState('');

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
    if (email) {
      const keySha = new KeySha();
      let filterAnswer = [];
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
        toast.error(`最少回答一个完整问题!`);
        return;
      }
      const kvShares: any[] = [];
      const errArr: string[] = [];
      for (let i = 0; i < filterAnswer.length; i++) {
        const s = filterAnswer[i];
        try {
          console.log(s);
          const q = s.list.map((val: any) => val.q).join('');
          const a = s.list.map((val: any) => val.a).join('');
          const v = await keySha.get(email, q, a);
          kvShares.push(v);
          errArr.push('');
        } catch (error) {
          errArr.push(`问题${chineseNumMap[i]}答案错误`);
        }
      }
      setKvError(errArr);
      if (!kvShares.length) {
        toastErr();
        return;
      }
      const shares = [serverShare, ...kvShares].filter(Boolean);
      await restoreEntropy(shares);
    }
  };
  const userSharesSubmit = async () => {
    const shares = [serverShare, shareB].filter(Boolean);
    await restoreEntropy(shares as string[]);
  };
  const restoreEntropy = async (shares: string[]) => {
    await onSubmit(shares);
  };
  const selectChange = (e: any) => {
    setKvError([]);
    setSelectValue(e);
  };
  return (
    <div className='pt-2'>
      {type == 1 ? (
        <QuestionDefault
          onSubmit={submitHandler}
          initList={questionList}
          type='restore'
          className='mb-8'
          buttonText='恢复'></QuestionDefault>
      ) : (
        <Question
          onSubmit={submitHandler}
          initList={questionList}
          type='restore'
          className='mb-8'
          buttonText='恢复'></Question>
      )}
    </div>
  );
};
