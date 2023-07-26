import { Button, Text, Textarea } from '@nextui-org/react';

import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { ConfirmDelModel } from './components/ConfirmDelModel';
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
  const { protectorStatus, changeProtectorStatus } = useGlobalStore(
    (state) => state,
  );
  const { accountInfo, getLocalAccountInfo } = useAccountStore(
    (state) => state,
  );
  const [delName, setDelName] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const list = useMemo(() => accountInfo.guardians, [accountInfo.guardians]);

  const add = () => {
    nav(ROUTE_PATH.ACCOUNT_PROTECTOR_ADD);
  };
  const backup = async () => {
    await account.backupByGuardian();
    changeProtectorStatus(false);
    toast.success('备份成功');
    await getLocalAccountInfo();
  };
  const delHandler = async (name: string) => {
    setShowStatus(true);
    setDelName(name);
  };
  const delGuardian = async (name: string) => {
    const { code, msg } = await account.delGuardian({ account: name });
    if (code === '000000') {
      toast.success(msg || '删除成功');
      await getLocalAccountInfo();
    } else {
      toast.error(msg || '删除失败');
      throw new Error(msg);
    }
  };
  const delConfirm = async () => {
    await delGuardian(delName);
  };
  const closeShow = () => {
    setShowStatus(false);
  };
  useEffect(() => {
    if (protectorStatus) {
      backup();
    }
  }, [protectorStatus]);
  return (
    <LayoutThird
      title='守护者'
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
          {!!list?.length &&
            list.map((v, i) => (
              <ProtectorItem
                key={v.Account}
                showDel={list.length !== 1}
                type='email'
                account={v.AccountMask}
                onDel={() => delHandler(v.Account)}
              />
            ))}
        </div>
        <ConfirmDelModel
          onConfirm={delConfirm}
          onClose={closeShow}
          show={showStatus}
        />
      </div>
    </LayoutThird>
  );
}
