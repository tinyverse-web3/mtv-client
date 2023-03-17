import { useMemo } from 'react';
import { Loading, Textarea, Row } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { Select } from '@/components/form/Select';
import { useState, useEffect } from 'react';
import { KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import { Question } from './Question';

const chineseNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
interface Props {
  onSubmit: (shares: string[]) => void;
  serverShare?: string;
  questionList?: any[];
}
export const QuestionRestore = ({
  onSubmit,
  serverShare,
  questionList,
}: Props) => {
  const [selectValue, setSelectValue] = useState('1');
  const [kvError, setKvError] = useState<string[]>([]);
  const selectList = useMemo(() => {
    const _l = [
      {
        label: '用户保存的分片',
        value: '1',
      },
    ];
    if (questionList?.length) {
      _l.push({
        label: '安全问题的分片',
        value: '2',
      });
    }
    return _l;
  }, [questionList]);
  const userInfo = useGlobalStore((state) => state.userInfo);
  // const [shareA, setShareA] = useState('');
  const [shareB, setShareB] = useState('');

  const shareBChange = (e: any) => {
    setShareB(e.target.value?.trim());
  };

  const toastErr = () => {
    for (let j = 0; j < kvError.length; j++) {
      const err = kvError[j];
      if (err) {
        toast.error(err);
        break;
      }
    }
  };

  const submitHandler = async (_list: any[]) => {
    const { email } = userInfo;
    if (email) {
      const keySha = new KeySha();
      const filterAnswer = _list.filter(
        (v) => v.a !== undefined && v.a !== null && v.a !== '',
      );
      if (!filterAnswer.length) {
        toast.error(`最少回答一个问题!`);
        return;
      }
      const kvShares: any[] = [];
      const errArr: string[] = [];
      console.log(email);
      for (let i = 0; i < filterAnswer.length; i++) {
        const s = filterAnswer[i];
        try {
          console.log(s);
          const v = await keySha.get(email, s.q, s.a);
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
      <Row className='mb-8' justify='center'>
        <Textarea
          fullWidth
          bordered
          readOnly
          value={serverShare}
          labelPlaceholder='服务器分片'
        />
      </Row>
      <Select
        list={selectList}
        value={selectValue}
        onChange={selectChange}
        placeholder='请选择一个恢复方式'
      />
      {selectValue === '1' ? (
        <>
          <Row className='mb-8 mt-8' justify='center'>
            <Textarea
              fullWidth
              bordered
              value={shareB}
              onChange={shareBChange}
              labelPlaceholder='用户分片'
            />
          </Row>
          <Button
            disabled={!shareB}
            auto
            className='w-full'
            onPress={userSharesSubmit}>
            恢复
          </Button>
        </>
      ) : (
        questionList && (
          <Question
            onSubmit={submitHandler}
            initList={questionList}
            type='restore'
            className='mb-8'
            buttonText='恢复'></Question>
        )
      )}
    </div>
  );
};
