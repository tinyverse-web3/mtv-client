import { useEffect, useMemo, useState } from 'react';
import { Image, Button } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';

import { useQuestionStore, useWalletStore, useGlobalStore } from '@/store';

import imageSuccess from '@/assets/images/icon-success.png';
import imageError from '@/assets/images/icon-error.png';
// const imageError = new URL(
//   '@/assets/images/icon-success.png',
//   import.meta.url,
// ).href;

export default function QuestionVerifyResult() {
  const nav = useNavigate();

  const { state } = useLocation();
  const userInfo = useGlobalStore((state) => state.userInfo);
  const wallet = useWalletStore((state) => state.wallet);
  const [shareA, setShareA] = useState<string>();
  const { list: initList, type } = useQuestionStore((state) => state);
  const { setUserInfo, calcUserLevel } = useGlobalStore((state) => state);

  const toAccount = async () => {
    
    nav(ROUTE_PATH.ACCOUNT);
  };
  const splitKey = async (threshold = 2, account = 3) => {
    return await wallet?.sssSplit(account, threshold);
  };
  const addQuestionQuery = useMemo(() => {
    return initList.map((val) => ({
      content: JSON.stringify(
        val.list.map((s) => ({ content: s.q, characters: s.l })),
      ),
      title: val.title,
      type,
    }));
  }, [initList]);
  const { mutate: setUserQuestion } = useRequest<any[]>({
    url: '/question/add',
    arg: {
      method: 'post',
      auth: true,
      query: addQuestionQuery,
    },
  });

  const { mutate: saveSssData } = useRequest({
    url: '/user/savesssdata4question',
    arg: {
      method: 'post',
      auth: true,
      query: { questionSssData: shareA },
    },
  });
  const onSubmit = async () => {
    console.log(initList);
    let list = initList.map((v, i) => {
      return {
        id: i,
        list: v.list.filter((s: any) => s.a),
        title: v.title,
      };
    });
    list = list.filter((v) => v.list.length);
    try {
      const { email } = userInfo;
      const shareKeys = await splitKey(2, list.length + 1);
      if (shareKeys && email) {
        await setShareA(shareKeys[0]);
        const kvShares = shareKeys.slice(1);
        const kvMap = kvShares?.map((s, i) => {
          const keySha = new KeySha();
          const q = list[i].list.map((val) => val.q).join('');
          const a = list[i].list.map((val) => val.a).join('');
          return keySha.set(email, q, a, s);
        });
        await Promise.all([...kvMap, saveSssData()]);
        await setUserQuestion();
        await setUserInfo({ maintainQuestion: true });
        await calcUserLevel();
        toast.success('备份成功');
        toAccount();
      }
    } catch (error) {
      console.log(error);
      toast.error('备份失败');
    }
  };
  useEffect(() => {
    if (!initList.length) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  }, []);
  return (
    <LayoutThird title='智能隐私备份' path={ROUTE_PATH.ACCOUNT_QUESTION_VERIFY}>
      {state ? (
        <div className='px-6 pt-10'>
          <Image src={imageSuccess} className='w-40 mb-10' />
          <Button className='w-full' size='lg' onPress={onSubmit}>
            完成
          </Button>
        </div>
      ) : (
        <div className='px-6 pt-10'>
          <Image src={imageError} className='w-40 mb-10' />
          <Button className='w-full mb-6' size='lg' onPress={() => nav(-1)}>
            恢复测试
          </Button>
          <Button
            className='w-full'
            size='lg'
            onPress={() => nav(ROUTE_PATH.ACCOUNT_QUESTION)}>
            重新设置
          </Button>
        </div>
      )}
    </LayoutThird>
  );
}
