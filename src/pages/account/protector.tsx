import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { Empty } from '@/components/Empty';
import { ConfirmDelModel } from './components/ConfirmDelModel';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
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
          <Icon icon='mdi:trash-can-outline' className=' w-5 h-5' />
        </div>
      )}
    </div>
  );
};

export default function AccountProtector() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { accountInfo, getLocalAccountInfo } = useAccountStore(
    (state) => state,
  );
  const [delName, setDelName] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const list = useMemo(() => accountInfo.guardians, [accountInfo.guardians]);

  const add = () => {
    nav(ROUTE_PATH.ACCOUNT_PROTECTOR_ADD);
  };
  const delHandler = async (name: string) => {
    setShowStatus(true);
    setDelName(name);
  };
  const delGuardian = async (name: string) => {
    const { code, msg } = await account.delGuardian({ account: name });
    if (code === '000000') {
      toast.success(msg || t('common.toast.delete_success'));
      await getLocalAccountInfo();
    } else {
      toast.error(msg || t('common.toast.delete_error'));
      throw new Error(msg);
    }
  };
  const delConfirm = async () => {
    await delGuardian(delName);
  };
  const closeShow = () => {
    setShowStatus(false);
  };
  return (
    <LayoutThird
      title={t('pages.account.protector.title')}
      rightContent={
        <Icon
          onClick={add}
          icon='mdi:plus-circle-outline '
          className='text-xl'></Icon>
      }>
      <div className='p-4'>
        <div className='hint-text-box'>
          {t('pages.account.protector.hint')}
        </div>
        <div>
          {!list?.length && <Empty />}
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
