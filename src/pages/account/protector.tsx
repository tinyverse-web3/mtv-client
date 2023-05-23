import { Button, Text, Textarea } from '@nextui-org/react';

import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore, useAccountStore } from '@/store';
import { KeySha } from '@/lib/account';
import { toast } from 'react-hot-toast';
interface GuardItem {
  type: string;
  account: string;
  showDel: boolean;
  onDel: () => void;
}
const ProtectorItem = ({ type, account, onDel, showDel }: GuardItem) => {
  const typeMap: any = {
    email: 'Email',
  };
  return (
    <div className='flex items-center h-14'>
      <span>{typeMap[type]}</span>
      <div className='flex-1 text-end'>{account}</div>
      {showDel && (
        <div className='p-3 -mr-3' onClick={() => onDel?.()}>
          <div className='i-mdi-trash-can-outline w-5 h-5'></div>
        </div>
      )}
    </div>
  );
};

export default function AccountProtector() {
  const nav = useNavigate();
  // const [shareA, setShareA] = useState('');
  const [shares, setShares] = useState<string[]>([]);
  const [delId, setDelId] = useState('');
  const wallet = useWalletStore((state) => state.wallet);
  const { protectorStatus, changeProtectorStatus } =
    useGlobalStore((state) => state);
  const { account } = useAccountStore((state) => state);
  const list = useMemo(() => account.accountInfo.guardians, [account]);

  const add = () => {
    nav(ROUTE_PATH.ACCOUNT_PROTECTOR_ADD);
  };
  const backup = async () => {
    await account.backupByGuardian();
    changeProtectorStatus(false);
    toast.success('备份成功');
  };
  const delHandler = async (name: string) => {
    await account.delGuardian({ account: name });
  };
  useEffect(() => {
    if (protectorStatus) {
      backup();
    }
  }, [protectorStatus]);
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
          <div>
            {list?.length &&
              list.map((v, i) => (
                <ProtectorItem
                  key={v.name}
                  showDel={list.length !== 1}
                  type={v.type}
                  account={v.name}
                  onDel={() => delHandler(v.name)}
                />
              ))}
            {/* <Button
                size='lg'
                className='mx-auto mb-6 w-full'
                onPress={backup}>
                备份
              </Button> */}
          </div>
          {/* ) : (
            <div className='h-20 flex justify-center'>
              还未设置守护者。点击设置守护者。
            </div>
          )} */}
        </div>
      </div>
    </LayoutThird>
  );
}
