import { Button, Text, Textarea } from '@nextui-org/react';

import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore } from '@/store';
import { KeySha } from '@/lib/account';
import { toast } from 'react-hot-toast';
interface GuardItem {
  type: string;
  account: string;
  onDel: () => void;
}
const ProtectorItem = ({ type, account, onDel }: GuardItem) => {
  const typeMap: any = {
    email: 'Email',
  };
  return (
    <div className='flex items-center h-14'>
      <span>{typeMap[type]}</span>
      <div className='flex-1 text-end'>{account}</div>
      <div className='p-3 -mr-3' onClick={() => onDel?.()}>
        <div className='i-mdi-trash-can-outline w-5 h-5'></div>
      </div>
    </div>
  );
};

export default function AccountProtector() {
  const nav = useNavigate();
  const [shareA, setShareA] = useState('');
  const [delId, setDelId] = useState('');
  const wallet = useWalletStore((state) => state.wallet);
  const { setUserInfo, calcUserLevel } = useGlobalStore((state) => state);
  const { data, mutate, loading } = useRequest<any[]>({
    url: '/guardian/list',
    arg: {
      auth: true,
      method: 'get',
    },
  });

  const { mutate: saveSssData } = useRequest({
    url: '/user/savesssdata4guardian',
    arg: {
      method: 'post',
      auth: true,
      query: { guardianSssData: shareA },
    },
  });
  const { mutate: delGuardian } = useRequest(
    {
      url: '/guardian/del',
      arg: {
        auth: true,
        method: 'post',
        query: { id: delId },
      },
    },
    {
      onSuccess() {
        mutate();
      },
      onError() {
        // setLoading(false);
      },
    },
  );
  const { mutate: updateSafeLevel } = useRequest({
    url: '/user/updatesafelevel',
    arg: {
      method: 'post',
      auth: true,
      query: {
        safeLevel: 3,
      },
    },
  });
  const add = () => {
    nav(ROUTE_PATH.ACCOUNT_PROTECTOR_ADD);
  };
  const backup = async () => {
    const shares = await wallet?.sssSplit(2, 2);
    if (shares && data) {
      await setShareA(shares[0]);
      const kvMap = data.map((s, i) => {
        const keySha = new KeySha();
        return keySha.set(s.account, '', '', shares[1]);
      });
      try {
        await Promise.all([...kvMap, saveSssData()]);
        await setUserInfo({ maintainProtector: true });
        await calcUserLevel();
        toast.success('备份成功');
      } catch (error) {
        toast.error('备份失败');
      }
    }
  };
  const delHandler = async (id: string) => {
    await setDelId(id);
    console.log('delId', delId);
    delGuardian();
  };
  useEffect(() => {
    mutate();
  }, []);
  const existed = useMemo(() => {
    return data && data.length;
  }, [data]);
  return (
    <LayoutThird
      title='守护者'
      path={ROUTE_PATH.ACCOUNT}
      rightContent={
        <div onClick={add} className='i-mdi-plus-circle-outline text-5'></div>
      }>
      <div className='p-4'>
        <Text className='text-14px mb-6'>
          守护者可用于身份验证、社交恢复等。增加多个守护者让你的账户更安全。
          <br />
          请放心，我们采用零知识证明（zkp）技术，不保存任何用户隐私。
        </Text>
        <div>
          {existed ? (
            <div>
              {data &&
                data.map((v) => (
                  <ProtectorItem
                    key={v.Id}
                    type={v.type}
                    account={v.accountMask}
                    onDel={() => delHandler(v.Id)}
                  />
                ))}
              <Button
                size='lg'
                className='mx-auto mb-6 w-full'
                onPress={backup}>
                备份
              </Button>
            </div>
          ) : (
            <div className='h-20 flex justify-center'>
              还未设置守护者。点击设置守护者。
            </div>
          )}
        </div>
      </div>
    </LayoutThird>
  );
}
