import { Button, Text } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { useList } from 'react-use';
import { useEffect, useMemo } from 'react';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';
import { cloneDeep, divide, map } from 'lodash';
import { useMtvStorageStore } from '@/store';
interface QuestionItem {
  q: string;
  a?: string;
  p?: string;
  Id?: string;
  l?: number;
  error?: boolean;
}
interface QuestionList {
  id: number | string;
  title: string;
  list: QuestionItem[];
}
interface Props {
  onSubmit: (list: QuestionList[]) => void;
  type: 'maintain' | 'restore' | 'verify';
  className?: string;
  buttonText?: string;
  children?: any;
  initList?: any[];
}
const LOCAL_QUESTION = 'local_question';
export const QuestionDefault = ({
  onSubmit,
  type,
  className,
  initList = [],
  buttonText = '备份',
  children,
}: Props) => {
  const [list, { set, push, updateAt, remove }] = useList<QuestionList>([]);
  const { mtvStorage } = useMtvStorageStore((state) => state);
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
        type: 1,
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

  const generateInitList = () => {
    console.log(initList);
    let _list = initList.map((v, i) => {
      return {
        id: i,
        list: v.list.map((s: any) => ({ q: s.q, a: '', l: s.l, p: s.p })),
        title: v.title,
      };
    });
    _list = _list.filter((v) => v.list.length);
    set(_list);
  };
  const answerChange = async (i: number, j: number, e: any) => {
    const _list = cloneDeep(list[i]);
    _list.list[j].a = e;
    _list.list[j].l = e.length;
    await mtvStorage?.put(LOCAL_QUESTION, _list);
    updateAt(i, _list);
  };
  useEffect(() => {
    if (mtvStorage) {
      mtvStorage.get(LOCAL_QUESTION).then((res) => {
        console.log('res');
        console.log(res);
        if (res) {
          // set(res);
        }
      });
    }
  }, [mtvStorage]);
  useEffect(() => {
    if (data) {
      const _list = data.map((v, i) => {
        const childrenList = JSON.parse(v.content);
        return {
          id: i,
          title: v.title,
          list: childrenList.map((s: any) => ({
            q: s.content.replace(/\([\S\s]*\)/g, ''),
            a: '',
            p: /\(([\S\s]*)\)/.exec(s.content)?.[1],
            l: s.character,
          })),
        };
      });
      set(_list);
    }
  }, [data, userList]);

  const validList = () => {
    let validStatus = true;
    const _list = cloneDeep(list);
    let answerLen = 0;
    for (let i = 0; i < _list.length; i++) {
      const item = _list[i];
      item.list = item.list.filter((v) => v.a);
      if (item.list.length) {
        answerLen++;
        const keyLen = item.list.reduce(
          (a, b) => a + b.q.length + Number(b?.l),
          0,
        );
        if (keyLen < 16) {
          toast.error(`答案长度不足,请在多输入一些内容`);
          validStatus = false;
          break;
        }
      }
    }
    if (answerLen < 2 && validStatus) {
      toast.error('请至少填写两个分类的问题答案');
      validStatus = false;
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
        {list.map((val, i) => (
          <div className='mb-4' key={i}>
            <div className='h-14 flex mb-2 items-center border-b-gray-200 border-b-solid border-b text-5 font-600'>
              {val.title}
            </div>
            {val?.list.map((v, j) => (
              <div className='flex break-keep items-center  mb-2' key={v.q}>
                <div className='w-30'>{v.q}</div>
                <div className='flex-1'>
                  <Input
                    value={v.a}
                    size='md'
                    placeholder={v.p}
                    rounded={false}
                    onChange={(e: any) => answerChange(i, j, e)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='flex'>
        <Button className='flex-1' auto onPress={submitQuestion}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};