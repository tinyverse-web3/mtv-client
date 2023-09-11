import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
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
  len?: number;
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
  buttonText,
  children,
}: Props) => {
  const { t } = useTranslation();
  buttonText = buttonText || t('common.backup');
  const [list, { set, updateAt }] = useList<QuestionList>([]);
  const [tmpList, { set: setTmpList }] = useList<any>([]);
  const [userList, { set: setUserList }] = useList<any>([]);
  const [localList, { set: setLocalList }] = useList<any>([]);
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
    const data = await account.getQuestions(1);
    if (data?.length) {
      setUserList(data);
      console.log(data);
    }
  };
  const generateInitList = () => {
    let _list = initList.map((v, i) => {
      return {
        id: i,
        list: v.list.map((s: any) => ({
          q: s.q,
          a: '',
          l: s.l,
          p: s.p,
          len: s.l,
        })),
        title: v.title,
      };
    });
    console.log(_list);
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
      localStorage.setItem(
        `local_privacy_${accountInfo.publicKey}`,
        JSON.stringify(list),
      );
    }
  };
  useDebounce(saveLocalList, 300, [list]);

  useEffect(() => {
    console.log(localList);
    console.log(userList);
    if (localList.length) {
      set(localList);
    } else if (userList.length && userList[0].Type == 1) {
      const _list = cloneDeep(userList).map((v, i) => {
        const childrenList = v.Content;
        return {
          id: i,
          title: v.Title,
          list: childrenList.map((s: any) => {
            const q: string = s.Content.replace(/\([\S\s]*\)/g, '');
            const a = s.Answer || '';
            return {
              q: q,
              a: a || '',
              p: /\(([\S\s]*)\)/.exec(s.Content)?.[1],
              l: s.Characters,
              len: s.Characters,
            };
          }),
        };
      });
      console.log(_list);
      set(_list);
    } else if (tmpList.length) {
      const _list = cloneDeep(tmpList).map((v, i) => {
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
              l: s.Characters,
            };
          }),
        };
      });
      set(_list);
    }
  }, [tmpList, userList, localList]);

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
          toast.error(t('pages.account.question.toast.error_1'));
          validStatus = false;
          break;
        }
      }
    }
    if (answerLen < 2 && validStatus) {
      toast.error(t('pages.account.question.toast.error_2'));
      validStatus = false;
    }
    return validStatus;
  };
  const submitQuestion = async () => {
    const validStatus = validList();
    console.log(validStatus);
    console.log(list);
    if (validStatus) {
      await onSubmit(list);
    }
  };
  const RendText = ({ num }: any) => {
    return disabled && Number(num) ? (
      <div className='break-keep text-xs'>
        {num}
        {t('pages.account.question.toast.error_3_end')}
      </div>
    ) : (
      <></>
    );
  };
  console.log(list);
  useEffect(() => {
    if (!initList?.length) {
      getTmpQuestions();
      getUserQuestions();
    } else {
      generateInitList();
    }
  }, []);
  useEffect(() => {
    if (!initList?.length && accountInfo.publicKey) {
      const localListRes = localStorage.getItem(
        `local_privacy_${accountInfo.publicKey}`,
      );
      try {
        console.log(localListRes)
        if (localListRes) {
          const localList = JSON.parse(localListRes);
          setLocalList(localList);
        }
      } catch (error) {}
    }
  }, [accountInfo.publicKey])
  return (
    <div className={className}>
      <div className='mb-4'>
        {list?.map((val, i) => (
          <div className='mb-4' key={i}>
            <div className='h-14 flex mb-2 items-center border-b-gray-200 border-b-solid border-b text-5 font-600'>
              {val.title}
            </div>
            {val?.list.map((v, j) => (
              <div className='break-keep mb-2' key={j}>
                <div className='mb-2'>
                  <div>{v.q}</div>
                  {type !== 'maintain' && !!(v?.len && !isNaN(v?.len)) && (
                    <div className='text-xs'>
                      {t('pages.account.question.toast.error_3_first')}
                      {v?.len}
                      {t('pages.account.question.toast.error_3_end')}
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <Input
                    value={v.a}
                    size='md'
                    placeholder={v.p}
                    labelRight={<RendText num={v.a?.length} />}
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
