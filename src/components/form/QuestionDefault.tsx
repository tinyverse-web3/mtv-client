import { Button, Text } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { useList } from 'react-use';
import { useEffect, useMemo, useState } from 'react';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';
import { cloneDeep, divide, map } from 'lodash';
import { useAccountStore } from '@/store';
import { useDebounce } from 'react-use';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [list, { set, push, updateAt, remove }] = useList<QuestionList>([]);
  const [localList, setLocalList] = useState([]);
  const [tmpList, setTmpList] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const { accountInfo } = useAccountStore((state) => state);
  const disabled = useMemo(
    () => type === 'restore' || type === 'verify',
    [type],
  );

  const getTmpQuestions = async () => {
    // const data = await account.getTmpQuestions(1);
    // if (data?.length) {
    setTmpList([
      {
        Title: t('pages.account.question.default.one.title'),
        Content: [
          {
            Content: t('pages.account.question.default.one.name'),
          },
          {
            Content: t('pages.account.question.default.one.gender'),
          },
          
          {
            Content: t('pages.account.question.default.one.birth_date'),
          },
          {
            Content: t('pages.account.question.default.one.birth_city'),
          },
          {
            Content: t('pages.account.question.default.one.id'),
          },
          {
            Content: t('pages.account.question.default.one.social_number'),
          },
          {
            Content: t('pages.account.question.default.one.blood'),
          },
          {
            Content: t('pages.account.question.default.one.university'),
          },
          {
            Content: t('pages.account.question.default.one.enrollment'),
          },
        ],
        Type: 1,
      },
      {
        Title: t('pages.account.question.default.two.title'),
        Content: [
          {
            Content: t('pages.account.question.default.two.phone'),
          },
          {
            Content: t('pages.account.question.default.two.email'),
          },
          {
            Content: t('pages.account.question.default.two.apple'),
          },
          {
            Content: t('pages.account.question.default.two.google'),
          },
          {
            Content: t('pages.account.question.default.two.tw'),
          },
          {
            Content: t('pages.account.question.default.two.fb'),
          },
          {
            Content: t('pages.account.question.default.two.wx'),
          },
          {
            Content: t('pages.account.question.default.two.qq'),
          },
          {
            Content: t('pages.account.question.default.two.tb'),
          },
          {
            Content: t('pages.account.question.default.two.wx'),
          },
        ],
        Type: 1,
      },
      {
        Title: t('pages.account.question.default.three.title'),
        Content: [
          {
            Content: t('pages.account.question.default.three.card_one_bank'),
          },
          {
            Content: t('pages.account.question.default.three.card_one_num'),
          },
          {
            Content: t('pages.account.question.default.three.card_two_bank'),
          },
          {
            Content: t('pages.account.question.default.three.card_two_num'),
          },
          {
            Content: t('pages.account.question.default.three.credit_card_bank'),
          },
          {
            Content: t('pages.account.question.default.three.credit_card_num'),
          },
        ],
        Type: 1,
      },
      {
        Title: t('pages.account.question.default.four.title'),
        Content: [
          {
            Content: t('pages.account.question.default.four.contact'),
          },
          {
            Content: t('pages.account.question.default.four.contact_phone'),
          },
          {
            Content: t('pages.account.question.default.four.first_car_brand'),
          },
          {
            Content: t('pages.account.question.default.four.first_car_plate'),
          },
          {
            Content: t('pages.account.question.default.four.elementary_school'),
          },
          {
            Content: t('pages.account.question.default.four.middle_school'),
          },
          {
            Content: t('pages.account.question.default.four.high_school'),
          },
        ],
        Type: 1,
      },
    ]);
    // }
  };
  const getUserQuestions = async () => {
    const data = await account.getQuestions();
    if (data?.length) {
      setUserList(data);
      console.log(data);
    }
  };
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
    updateAt(i, _list);
  };
  const saveLocalList = () => {
    if (type === 'maintain') {
      console.log('maintain save');
      // mtvStorage?.put(LOCAL_QUESTION, list);
    }
  };
  useDebounce(saveLocalList, 300, [list]);

  useEffect(() => {
    if (tmpList) {
      const _list = tmpList.map((v, i) => {
        const childrenList = v.Content;
        return {
          id: i,
          title: v.Title,
          list: childrenList.map((s: any) => {
            const q: string = s.Content.replace(/\([\S\s]*\)/g, '');
            const a = accountInfo.privacyInfo[q] || '';
            return {
              q: q,
              a: a,
              p: /\(([\S\s]*)\)/.exec(s.Content)?.[1],
              l: s.Character,
            };
          }),
        };
      });
      set(_list);
    }
  }, [tmpList, accountInfo]);

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
      getTmpQuestions();
      // getUserQuestions();
    } else {
      generateInitList();
    }
  }, []);
  return (
    <div className={className}>
      <div className='mb-4'>
        {list?.map((val, i) => (
          <div className='mb-4' key={i}>
            <div className='h-14 flex mb-2 items-center border-b-gray-200 border-b-solid border-b text-5 font-600'>
              {val.title}
            </div>
            {val?.list.map((v, j) => (
              <div className='break-keep mb-2' key={v.q}>
                <div className='mb-2'>
                  <div>{v.q}</div>
                  {type !== 'maintain' && !!(v.l && !isNaN(v.l)) && (
                    <div className='text-12px'>答案共{v.l}个字符</div>
                  )}
                </div>
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
