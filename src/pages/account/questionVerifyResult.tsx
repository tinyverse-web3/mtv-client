import { useEffect, useMemo, useState } from 'react';
import { Image, Button } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';
import { useQuestionStore, useWalletStore, useGlobalStore } from '@/store';

import imageSuccess from '@/assets/images/icon-success.png'
import imageError from '@/assets/images/icon-error.png'
// const imageError = new URL(
//   '@/assets/images/icon-success.png',
//   import.meta.url,
// ).href;

export default function QuestionVerifyResult() {
  const nav = useNavigate();
  
  const { state } = useLocation();
  const userInfo = useGlobalStore((state) => state.userInfo);
  const wallet = useWalletStore((state) => state.wallet);
  const setMaintain = useGlobalStore((state) => state.setMaintain);
  const initList = useQuestionStore((state) => state.list);
  const [shareA, setShareA] = useState<string>();
  const toAccount = () => {
    nav(ROUTE_PATH.ACCOUNT);
  };
  const splitKey = async (threshold = 2, account = 3) => {
    return await wallet?.sssSplit(account, threshold);
  };
  const addQuestionQuery = useMemo(() => {
    return initList.map((val) => `${val.content}**${val.a.length}**`);
  }, [initList]);
  const { mutate: setUserQuestion } = useRequest<any[]>({
    url: '/question/add',
    arg: {
      method: 'post',
      auth: true,
      query: addQuestionQuery,
    },
  });

  const query = useMemo(() => {
    const { publicKey, address } = wallet || {};
    return {
      sssData: shareA,
      publicKey: publicKey,
      address: address,
    };
  }, [wallet, shareA]);

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
        setMaintain(true);
        toast.success('服务器分片保存成功');
      },
    },
  );
  useEffect(() => {
    if (shareA) {
      modifyuser();
    }
  }, [shareA]);
  const onSubmit = async () => {
    const { email } = userInfo;
    const shareKeys = await splitKey(2, initList.length + 1);
    if (shareKeys && email) {
      setShareA(shareKeys[0]);
      const kvShares = shareKeys.slice(1);
      const kvMap = kvShares?.map((s, i) => {
        const keySha = new KeySha();
        return keySha.set(email, initList[i].content, initList[i].a as string, s);
      });
      await Promise.all(kvMap);
      await setUserQuestion();
    }
  };
  useEffect(() => {
    if (!initList.length) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  }, []);
  return (
    <LayoutThird title='智能隐私备份' path={ROUTE_PATH.SPACE_INDEX}>
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
          <Button className='w-full' size='lg' onPress={() => nav(ROUTE_PATH.ACCOUNT_QUESTION)}>
            重新设置
          </Button>
        </div>
      )}
    </LayoutThird>
  );
}
