import { Button, Text, Textarea, Row } from '@nextui-org/react';
import { QuestionSelect } from '@/components/Question/QuestionSelect';
import { useList } from 'react-use';
import { useState, useMemo, useEffect } from 'react';
import { Shamir, KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import { Question } from './Question';

interface Props {
  onSubmit: (privateKey: string) => void;
}
export const QuestionRestore = ({ onSubmit }: Props) => {
  const isLogin = useGlobalStore((state) => state.isLogin);
  const [shareA, setShareA] = useState('');
  const [shareB, setShareB] = useState('');

  const shareAChange = (e: any) => {
    setShareA(e.target.value?.trim());
  };
  const shareBChange = (e: any) => {
    setShareB(e.target.value?.trim());
  };
  const setMtvdbToUser = useGlobalStore((state) => state.setMtvdbToUser);
  const { mutate: getuserinfo } = useRequest(
    {
      url: '/user/getuserinfo',
      arg: { method: 'get', auth: true },
    },
    {
      onSuccess: (res) => {
        const { sssData } = res.data;
        setShareA(sssData);
        setMtvdbToUser(res.data.dbAddress, res.data.ipns);
      },
    },
  );
  const combine = async (shares: any[] = []) => {
    const sss = new Shamir();
    const sliceShares = shares.slice(0, 2);
    if (sliceShares.length === 2) {
      const combineKey = await sss.combine(sliceShares);
      return combineKey;
    }
  };

  const submitHandler = async (_list: any[]) => {
    // const { email = 'tset' } = userInfo;
    const email = 'test';
    const keySha = new KeySha();
    const filterAnswer = _list.filter(
      (v) => v.a !== undefined && v.a !== null && v.a !== '',
    );
    if (!filterAnswer.length) {
      toast.error(`最少回答一个问题或者输入自己保存的分片`);
      return;
    }
    const kvMap = filterAnswer?.map((s) => keySha.get(email, s.q, s.a));
    const kvShares = await Promise.all(kvMap);
    const shares = [shareA, ...kvShares, shareB].filter(Boolean);
    const privateKey = await combine(shares);
    await onSubmit(privateKey);
  };
  useEffect(() => {
    console.log(isLogin);
    if (isLogin) {
      getuserinfo();
    }
  }, [isLogin]);
  return (
    <Question
      onSubmit={submitHandler}
      type='restore'
      className='mb-8'
      buttonText='恢复'>
      <Row className='mb-8 mt-4' justify='center'>
        <Textarea
          fullWidth
          bordered
          readOnly
          value={shareA}
          onChange={shareAChange}
          labelPlaceholder='服务器分片'
        />
      </Row>
      <Row className='mb-8' justify='center'>
        <Textarea
          fullWidth
          bordered
          value={shareB}
          onChange={shareBChange}
          labelPlaceholder='用户分片'
        />
      </Row>
    </Question>
  );
};
