import { Button, Text } from '@nextui-org/react';
import { QuestionSelect } from '@/components/question/QuestionSelect';
import { useList } from 'react-use';
import { useEffect, useMemo } from 'react';
import { Shamir, KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore } from '@/store';
import { differenceBy } from 'lodash';
import toast from 'react-hot-toast';
import { cloneDeep, divide, map } from 'lodash';

interface QuestionItem {
  q: string;
  a?: string;
  Id?: string;
  l?: number;
  error?: boolean;
}
interface QuestionList {
  id: number;
  list: QuestionItem[];
  template: QuestionItem[];
  unselectList: QuestionItem[];
}
interface Props {
  onSubmit: (list: QuestionList[]) => void;
  type: 'maintain' | 'restore' | 'verify';
  className?: string;
  buttonText?: string;
  children?: any;
  initList?: any[];
}
const QUESTION_MAX = 4;
const QUESTION_CHILDREN_MAX = 3;
export const Question = ({
  onSubmit,
  type,
  className,
  initList = [],
  buttonText = '备份',
  children,
}: Props) => {
  const [list, { set, push, updateAt, remove }] = useList<QuestionList>([]);
  const disabled = useMemo(
    () => type === 'restore' || type === 'verify',
    [type],
  );
  const { data, mutate } = useRequest<any[]>({
    url: '/question/tmplist',
    arg: {
      method: 'get',
      auth: true,
      query: {
        type: 2,
      },
    },
  });
  const { data: userList, mutate: questionList } = useRequest<any[]>({
    url: '/question/list',
    arg: {
      method: 'get',
      auth: true,
    },
  });

  const chineseNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

  useEffect(() => {
    if (userList && data) {
      if (!userList?.length) {
        const _list = data.slice(0, 3).map((v, i) => {
          const list = JSON.parse(v.content);
          return {
            id: i,
            list: list.map((s: any) => ({
              q: s.content,
              a: '',
              l: Number(s.characters),
            })),
            template: list.map((s: any) => ({
              q: s.content,
            })),
            unselectList: [],
          };
        });
        set(_list);
      } else {
        const _list = userList.slice(0, 3).map((v, i) => {
          const list = JSON.parse(v.content);
          return {
            id: i,
            list: list.map((s: any) => ({
              q: s.content,
              a: '',
              l: Number(s.characters),
            })),
            template: list.map((s: any) => ({
              q: s.content,
            })),
            unselectList: [],
          };
        });
        set(_list);
      }
    }
  }, [userList, data]);
  const generateInitList = () => {
    const _list = initList.map((v, i) => {
      return {
        id: i,
        list: v.list.map((s: any) => ({ q: s.q, a: '', l: s.l })),
        template: [],
        unselectList: [],
      };
    });
    set(_list);
  };
  const answerChange = (i: number, j: number, { data }: any) => {
    const _list = cloneDeep(list[i]);
    _list.list[j].a = data.a;
    _list.list[j].q = data.q;
    _list.list[j].l = data.l;
    updateAt(i, _list);
  };
  const questionTemplate = useMemo(
    () =>
      data?.map((v, i) => {
        const list = JSON.parse(v.content);
        return {
          id: i,
          list: list.map((s: any) => ({
            q: s.content,
            a: '',
          })),
        };
      }),
    [data],
  );
  const unSelectList = useMemo(() => {
    return list.map((v) => {
      let unselList = differenceBy(v.template, v.list, 'q');
      unselList = unselList.map((v) => ({ ...v, a: '' }));
      return {
        ...v,
        unselectList: unselList,
      };
    });
  }, [list]);
  const isFull = useMemo(() => {
    return list.length === QUESTION_MAX || data?.length === list.length;
  }, [list]);
  const removeQuestion = (i: number) => {
    remove(i);
  };
  const validList = () => {
    let validStatus = true;
    if (type == 'restore') {
    } else {
      for (let i = 0; i < list.length; i++) {
        const question = list[i];
        for (let j = 0; j < question.list.length; j++) {
          const q = question.list[j];
          if (!q.a) {
            toast.error(
              `问题${chineseNumMap[i]}的第${j + 1}个子问题答案未输入`,
            );
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
  const addQuestion = () => {
    if (list.length <= QUESTION_MAX) {
      const disArr = differenceBy(questionTemplate as any, list, 'id');
      if (disArr.length) {
        push({ ...(disArr[0] as any), unselectList: [] });
      } else {
        push({
          id: list.length,
          template: [],
          list: [
            {
              q: '',
              a: '',
              l: 0,
              error: false,
            },
          ],
          unselectList: [],
        });
      }
    }
  };
  const addQuestionChildren = (i: number) => {
    const _list = cloneDeep(list[i]);
    _list.list.push({
      q: '',
      a: '',
      l: 0,
      error: false,
    });
    updateAt(i, _list);
  };
  const removeQuestionChildren = (i: number, j: number) => {
    const _list = cloneDeep(list[i]);
    _list.list.splice(j, 1);
    console.log(_list.list);
    updateAt(i, _list);
  };
  useEffect(() => {
    if (!initList?.length) {
      mutate();
      questionList();
    } else {
      generateInitList();
    }
  }, []);
  return (
    <div className={className}>
      <div className='mb-4'>
        {unSelectList.map((val, i) => (
          <div className='mb-4' key={i}>
            <div className='flex mb-2 items-center'>
              <Text>问题{chineseNumMap[i]}</Text>
              {!disabled && (
                <Button
                  light
                  size='sm'
                  auto
                  disabled={disabled}
                  className='px-3 text-4 ml-4'
                  onPress={() => removeQuestion(i)}>
                  <div className='i-mdi-close'></div>
                </Button>
              )}
            </div>
            {val.list.map((v, j) => (
              <QuestionSelect
                key={v.q}
                index={j}
                list={val.unselectList}
                disabled={disabled}
                select={v}
                className='mb-6'
                onRemove={() => removeQuestionChildren(i, j)}
                onChange={(e) => answerChange(i, j, { data: e })}
              />
            ))}
            {val.list.length < QUESTION_CHILDREN_MAX && type === 'maintain' && (
              <Button
                auto
                className='w-full'
                onPress={() => addQuestionChildren(i)}>
                <div className='i-mdi-plus-circle-outline text-5'></div> 子问题
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className='mb-4'>{children}</div>
      <div className='flex'>
        {list.length > 0 && (
          <Button className='flex-1' auto onPress={submitQuestion}>
            {buttonText}
          </Button>
        )}

        {!isFull && type === 'maintain' && (
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
