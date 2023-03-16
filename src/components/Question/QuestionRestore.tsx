import { Loading, Textarea, Row } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { Select } from '@/components/form/Select';
import { useState, useEffect } from 'react';
import {KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import { Question } from './Question';

const chineseNumMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
interface Props {
  onSubmit: (shares: string[]) => void;
}
export const QuestionRestore = ({ onSubmit }: Props) => {
  const [selectValue, setSelectValue] = useState('1');
  const [kvError, setKvError] = useState<string[]>([]);
  const selectList = [
    {
      label: '用户保存的分片',
      value: '1',
    },
    {
      label: '安全问题的分片',
      value: '2',
    },
  ];
  const isLogin = useGlobalStore((state) => state.isLogin);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const setMaintain = useGlobalStore((state) => state.setMaintain);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const [shareA, setShareA] = useState('');
  const [shareB, setShareB] = useState('');

  const shareAChange = (e: any) => {
    setShareA(e.target.value?.trim());
  };
  const shareBChange = (e: any) => {
    setShareB(e.target.value?.trim());
  };
  const setMtvdb = useGlobalStore((state) => state.setMtvdb);
  const { mutate: getuserinfo, loading: getUserLoading } = useRequest(
    {
      url: '/user/getuserinfo',
      arg: { method: 'get', auth: true },
    },
    {
      onSuccess: (res) => {
        const { sssData, email } = res.data;
        setShareA(sssData);
        setMaintain(!!sssData);
        setUserInfo({ email });
        setMtvdb(res.data.dbAddress, res.data.ipns);
      },
    },
  );
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
      for (let i = 0; i < filterAnswer.length; i++) {
        const s = filterAnswer[i];
        try {
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
      const shares = [shareA, ...kvShares].filter(Boolean);
      await restoreEntropy(shares);
    }
  };
  const userSharesSubmit = async () => {
    const shares = [shareA, shareB].filter(Boolean);
    await restoreEntropy(shares);
  };
  const restoreEntropy = async (shares: string[]) => {
    await onSubmit(shares);
  };
  const selectChange = (e: any) => {
    setKvError([]);
    setSelectValue(e);
  };
  useEffect(() => {
    if (isLogin) {
      getuserinfo();
    }
  }, [isLogin]);
  return (
    <div className='pt-2'>
      <Row className='mb-8' justify='center'>
        {getUserLoading ? (
          <Loading type='spinner' color='currentColor' size='sm' />
        ) : (
          <Textarea
            fullWidth
            bordered
            readOnly
            value={shareA}
            onChange={shareAChange}
            labelPlaceholder='服务器分片'
          />
        )}
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
        <Question
          onSubmit={submitHandler}
          type='restore'
          className='mb-8'
          buttonText='恢复'></Question>
      )}
    </div>
  );
};
