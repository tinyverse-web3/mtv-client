import { Button, Text } from '@nextui-org/react';
import { QuestionSelect } from '@/components/QuestionSelect';
import { useList } from 'react-use';
import { useEffect, useMemo } from 'react';
import { xorBy } from 'lodash';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';

interface QuestionList {
  q: string;
  a?: string;
  Id?: string;
  error?: boolean;
}

const QUESTION_MAX = 4;
export const Question = () => {
  const [list, { set, push, updateAt, remove }] = useList<QuestionList>([]);
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
        const userList = res.data?.map((v: any) => ({
          q: v.content,
          a: '',
          Id: '',
        }));
        set(userList);
      },
    },
  );
  const addQuestionQuery = useMemo(() => {
    return list.map((val) => val.q);
  }, [list]);
  const { mutate: setUserQuestion } = useRequest<any[]>({
    url: '/question/add',
    arg: {
      method: 'post',
      auth: true,
      query: addQuestionQuery,
    },
  });
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
    updateAt(i, { q: data.q, a: data.a });
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
    for (let i = 0; i < list.length; i++) {
      const question = list[i];
      if (!question.a) {
        toast.error(`问题${chineseNumMap[i]}答案未输入`);
        validStatus = false;
        break;
      }
    }
    return validStatus;
  };
  const submitQuestion = () => {
    const validStatus = validList();
    if (validStatus) {
      setUserQuestion();
    }
  };
  useEffect(() => {
    mutate();
    questionList();
  }, []);
  return (
    <>
      <div className='mb-4'>
        {list.map((val, i) => (
          <div className='' key={i}>
            <div className='flex mb-2 items-center'>
              <Text>问题{chineseNumMap[i]}</Text>
              <Button
                light
                size='sm'
                auto
                className='px-3 text-4 ml-4'
                onPress={() => removeQuestion(i)}>
                <div className='i-mdi-close'></div>
              </Button>
            </div>
            <QuestionSelect
              list={unselsectList}
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
            提交
          </Button>
        )}
        {!isFull && (
          <Button
            auto
            className={list.length > 0 ? 'w-30 ml-4' : 'w-full'}
            onPress={addQuestion}>
            增加
          </Button>
        )}
      </div>
    </>
  );
};
