import { useState, useMemo, useEffect } from 'react';
import { Card, Text } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { Shamir, KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore } from '@/store';
import { useCopyToClipboard } from 'react-use';
import toast from 'react-hot-toast';
import { Question } from './Question';

export const QuestionMaintain = () => {
  const [shareA, setShareA] = useState<string>();
  const [shareB, setShareB] = useState<string>();
  const wallet = useWalletStore((state) => state.wallet);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const [_, copyToClipboard] = useCopyToClipboard();
  const [list, setList] = useState<any[]>([]);

  const query = useMemo(() => {
    console.log(shareB);
    return {
      sssData: shareB,
      publicKey: wallet?.wallet?.publicKey,
      address: wallet?.wallet?.address,
    };
  }, [wallet, shareB]);

  const { mutate: modifyuser } = useRequest(
    {
      url: '/user/modifyuser',
      arg: {
        method: 'post',
        auth: true,
        query,
      },
    },
    {
      onSuccess() {
        toast.success('服务器分片保存成功');
      },
    },
  );
  useEffect(() => {
    if (shareB) {
      modifyuser();
    }
  }, [shareB]);
  const splitKey = async (threshold = 2, account = 3) => {
    const sss = new Shamir();
    const { entropy } = wallet?.wallet?.mnemonic || {};
    if (entropy) {
      const splitShares: any[] = await sss.split(
        entropy,
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
    const email = 'test';
    setList(_list);
    const shareKeys = await splitKey(2, _list.length + 2);
    console.log(shareKeys);
    if (shareKeys && email) {
      setShareA(shareKeys[0]);
      setShareB(shareKeys[1]);
      // console.log(shareKeys[1])
      // await modifyuser(modifyKey);
      const kvShares = shareKeys.slice(2);
      const kvMap = kvShares?.map((s, i) => {
        const keySha = new KeySha();
        return keySha.set(email, _list[i].q, _list[i].a as string, s);
      });
      await Promise.all(kvMap);
      await setUserQuestion();
    }
  };
  return (
    <Question type='maintain' onSubmit={onSubmit}>
      {shareA && (
        <Card>
          <Card.Body className='px-2 py-2 flex flex-row items-center'>
            <Text className='flex-1 overflow-x-auto'>{shareA}</Text>
            <Button
              className='min-w-6 ml-4'
              onPress={() => copyToClipboard(shareA)}>
              复制
            </Button>
          </Card.Body>
        </Card>
      )}
    </Question>
  );
};
