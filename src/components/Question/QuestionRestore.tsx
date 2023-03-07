import { Button, Text } from '@nextui-org/react';
import { QuestionSelect } from '@/components/Question/QuestionSelect';
import { useList } from 'react-use';
import { useState, useMemo } from 'react';
import { Shamir, KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import { Question } from './Question';

export const QuestionRestore = () => {
  const wallet = useWalletStore((state) => state.wallet);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const [list, setList] = useState<any[]>([]);
  const splitKey = async (threshold = 2, account = 3) => {
    const sss = new Shamir();
    const { privateKey } = wallet?.wallet || {};
    if (privateKey) {
      const splitShares: any[] = await sss.split(
        privateKey,
        threshold,
        account,
      );
      const hexShares = splitShares.map((s) => s.toString('hex'));
      return hexShares;
    }
  };

  const onSubmit = async (_list: any[]) => {
    // const { email = 'tset' } = userInfo;
    const email = 'test';
    const keySha = new KeySha();
    setList(_list);
    console.log(_list);
    console.log(email);
    // const shareKeys = await splitKey(2, 3);
    if (_list && email) {
      const kvMap = _list?.map((s) =>
        keySha.get(email, s.q, s.a),
      );
      const shares = await Promise.all(kvMap);
      console.log(shares);
    }
  };
  return <Question onSubmit={onSubmit} disabled={true} />;
};
