import { Button, Text } from '@nextui-org/react';
import { QuestionSelect } from '@/components/Question/QuestionSelect';
import { useList } from 'react-use';
import { useState, useMemo } from 'react';
import { Shamir, KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import { Question } from './Question';

interface Props {
  onSubmit: (privateKey: string) => void;
}
export const QuestionRestore = ({ onSubmit }: Props) => {
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
    if (filterAnswer?.length && email) {
      const kvMap = filterAnswer?.map((s) => keySha.get(email, s.q, s.a));
      const shares = await Promise.all(kvMap);
      const privateKey = await combine(shares);
      await onSubmit(privateKey);
    }
  };
  return (
    <Question
      onSubmit={submitHandler}
      type='restore'
      className='mb-8'
      buttonText='获取问答私钥'
    />
  );
};
