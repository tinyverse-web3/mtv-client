import { Button, Text } from '@nextui-org/react';
import { QuestionSelect } from '@/components/Question/QuestionSelect';
import { useList } from 'react-use';
import { useEffect, useMemo } from 'react';
import { Shamir, KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore } from '@/store';
import toast from 'react-hot-toast';

interface QuestionList {
  q: string;
  a?: string;
  Id?: string;
  l?: number;
  error?: boolean;
}
interface Props {
  onSubmit: (list: QuestionList[]) => void;
  type: 'maintain' | 'restore';
  className?: string;
  buttonText?: string;
  children?: any;
}
const QUESTION_MAX = 4;
export const Question = ({
  onSubmit,
  type,
  className,
  buttonText = '提交',
  children,
}: Props) => {
  const [list, { set, push, updateAt, remove }] = useList<QuestionList>([]);
  const disabled = useMemo(() => type === 'restore', [type]);
  const { data, mutate } = useRequest<any[]>({
    url: '/question/tmplist',
    arg: {
      method: 'get',
      auth: true,
    },
  });
  const { mutate: questionList } = useRequest<any[]>(
    {
      url: '/question/list',
      arg: {
        method: 'get',
        auth: true,
      },
    },
    {
      onSuccess: (res) => {
        const { data: qList = [] } = res || {};
        const userList = qList.map((v: any) => {
          const l = v.content.match(/\*\*(\d*)\*\*$/)?.[1] || 0;
          const content = v.content.replace(/\*\*(\d*)\*\*$/, '');
          return { q: content, a: '', Id: '', l: Number(l) };
        });
        set(userList);
      },
    },
  );

  const chineseNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const addQuestion = () => {
    if (list.length <= QUESTION_MAX) {
      push({
        q: '',
        a: '',
        Id: '',
        error: false,
      });
    }
  };
  const answerChange = (i: number, { data }: any) => {
    updateAt(i, { q: data.q, a: data.a, l: data.l });
  };
  const questionTemplate = useMemo(
    () => data?.map((v) => ({ q: v.content, Id: v.Id })) || [],
    [data],
  );
  const unselsectList = useMemo(() => {
    const _list = [];
    const selectList = list.filter((v) => !!v.q);
    for (let i = 0; i < questionTemplate.length; i++) {
      const item = questionTemplate[i];
      if (!selectList.find((v) => v.q === item.q)) {
        _list.push(item);
      }
    }
    return _list;
  }, [list, questionTemplate]);
  const isFull = useMemo(() => {
    return list.length === QUESTION_MAX || data?.length === list.length;
  }, [list, unselsectList]);
  const removeQuestion = (i: number) => {
    remove(i);
  };
  const validList = () => {
    let validStatus = true;
    if (type == 'restore') {
      const filterAnswer = list.filter(
        (v) => v.a !== undefined && v.a !== null && v.a !== '',
      );
      if (filterAnswer.length < 1) {
        toast.error(`最少回答一个问题`);
        validStatus = false;
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        const question = list[i];
        if (!question.a) {
          toast.error(`问题${chineseNumMap[i]}答案未输入`);
          validStatus = false;
          break;
        }
      }
      if (list.length < 1) {
        toast.error(`最少填写一个问题`);
        validStatus = false;
      }
    }

    return validStatus;
  };
  const submitQuestion = async () => {
    const validStatus = validList();
    console.log(validStatus);
    if (validStatus) {
      await onSubmit(list);
    }
  };
  useEffect(() => {
    mutate();
    questionList();
  }, []);
  return (
    <div className={className}>
      <div className='mb-4'>
        {list.map((val, i) => (
          <div className='' key={i}>
            <div className='flex mb-2 items-center'>
              <Text>问题{chineseNumMap[i]}</Text>
              <Button
                light
                size='sm'
                auto
                disabled={disabled}
                className='px-3 text-4 ml-4'
                onPress={() => removeQuestion(i)}>
                <div className='i-mdi-close'></div>
              </Button>
            </div>
            <QuestionSelect
              list={unselsectList}
              disabled={disabled}
              templeteList={questionTemplate}
              key={i}
              select={val}
              className='mb-6'
              onChange={(e) => answerChange(i, { data: e })}
            />
          </div>
        ))}
      </div>
      <div className='flex'>
        {list.length > 0 && (
          <Button className='flex-1' auto onPress={submitQuestion}>
            {buttonText}
          </Button>
        )}
        {children}
        {!isFull && (
          <Button
            auto
            className={list.length > 0 ? 'w-30 ml-4' : 'w-full'}
            onPress={addQuestion}>
            增加
          </Button>
        )}
      </div>
    </div>
  );
};
