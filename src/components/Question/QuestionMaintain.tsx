import { Button, Text } from '@nextui-org/react';
import { QuestionSelect } from '@/components/Question/QuestionSelect';
import { useList } from 'react-use';
import { useState, useMemo } from 'react';
import { Shamir, KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import { Question } from './Question';

export const QuestionMaintain = () => {
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
  const addQuestionQuery = useMemo(() => {
    return list.map((val) => `${val.q}**${val.l}**`);
  }, [list]);
  const { mutate: setUserQuestion } = useRequest<any[]>({
    url: '/question/add',
    arg: {
      method: 'post',
      auth: true,
      query: addQuestionQuery,
    },
  });
  const onSubmit = async (_list: any[]) => {
    // const { email = 'tset' } = userInfo;
    const email = 'test';

    setList(_list);
    console.log(_list);
    const shareKeys = await splitKey(2, 3);
    console.log(shareKeys);
    if (shareKeys && email) {
      const kvMap = shareKeys?.map((s, i) => {
        const keySha = new KeySha();
        return keySha.set(email, _list[i].q, _list[i].a as string, s);
      });
      await Promise.all(kvMap);
      const kvGetMap = _list?.map((s) => {
        const keySha = new KeySha();
        return keySha.get(email, s.q, s.a);
      });
      const shares = await Promise.all(kvGetMap);
      console.log(shares);
      await setUserQuestion();
    }
  };
  return <Question onSubmit={onSubmit} />;
};
