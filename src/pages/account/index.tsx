import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore, useAccountStore } from '@/store';
import { UserAvatar, ListRow, UserLevel } from './components';
import account from '@/lib/account/account';
export default function Account() {
  const nav = useNavigate();
  const { reset: resetGlobal, setLockStatus } = useGlobalStore(
    (state) => state,
  );

  const toPublicKey = () => {
    nav(ROUTE_PATH.ACCOUNT_PUBLICKEY);
  };

  const toProfile = async () => {
    nav(ROUTE_PATH.ACCOUNT_PROFILE);
  };
  const deleteUser = async () => {
    await resetGlobal();
    await account.lock();
    setLockStatus(true);
    nav(ROUTE_PATH.UNLOCK);
  };
  const toLocalSafe = () => {
    nav(ROUTE_PATH.ACCOUNT_LOCAL_SAFE);
  };
  const toMultiVerify = () => {
    nav(ROUTE_PATH.ACCOUNT_MULTI_VERIFY);
  };
  const toRestory = () => {
    nav(ROUTE_PATH.ACCOUNT_RESTORY);
  };
  const toSetting = () => {
    nav(ROUTE_PATH.SETTING_INDEX);
  };

  return (
    <div className='pt-4 px-4 text-14px'>
      <div className='flex mb-4'>
        <UserAvatar className='mr-4' />
        <UserLevel />
      </div>
      <ListRow label='我的名片' onPress={toProfile} />
      <ListRow label='本地安全策略' onPress={toLocalSafe} />
      <ListRow label='多因素验证' onPress={toMultiVerify} />
      <ListRow label='恢复途径' onPress={toRestory} />
      <ListRow label='系统设置' onPress={toSetting} />
      <ListRow label='关于' />
      <ListRow label='退出' onPress={deleteUser} />
    </div>
  );
}
