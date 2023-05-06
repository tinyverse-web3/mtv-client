import LayoutThird from '@/layout/LayoutThird';
import { useEffect } from 'react';
import { ROUTE_HASH_PATH, ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import {
  useGlobalStore,
  useWalletStore,
  useNostrStore,
  useMtvStorageStore,
} from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { Address } from '@/components/Address';
import { UserAvatar, ListRow, UserLevel } from './components';
import { Password } from '@/lib/account/wallet';

export default function Account() {
  const nav = useNavigate();
  const {
    userInfo,
    setUserInfo,
    // maintainPhrase,
    // maintainProtector,
    // maintainQuestion,
    reset: resetGlobal,
  } = useGlobalStore((state) => state);
  const resetNostr = useNostrStore((state) => state.reset);
  const { destory: destoryStorage } = useMtvStorageStore((state) => state);
  const { wallet, reset: resetWallet } = useWalletStore((state) => state);

  const toChangePwd = () => {
    nav(ROUTE_PATH.CHANGE_PWD);
  };
  const toPublicKey = () => {
    nav(ROUTE_PATH.ACCOUNT_PUBLICKEY);
  };
  const toChangeNickname = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_NAME);
    }
  };
  const toPharse = async () => {
    nav(ROUTE_PATH.ACCOUNT_PHRASE);
  };
  const toQuestion = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  };
  const toProtector = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_PROTECTOR);
    }
  };
  const deleteUser = async () => {
    await Promise.all([
      resetNostr(),
      resetWallet(),
      resetGlobal(),
      destoryStorage(),
      wallet?.delete(),
    ]);
    localStorage.clear();
    location.reload();
    // nav(ROUTE_PATH.INDEX, { replace: true });
  };
  const logout = async () => {
    const password = new Password();
    await Promise.all([resetWallet()]);
    await password.remove();
    location.replace('/unlock');
  };
  return (
    <LayoutThird title='我的资料' path={ROUTE_PATH.CHAT_LIST}>
      <div className='pt-4 px-4 text-14px'>
        <div className='flex'>
          <UserAvatar className='mr-4' />
          <UserLevel />
        </div>
        <ListRow
          label='名字'
          value={userInfo.nickname}
          onPress={toChangeNickname}
        />
        <ListRow
          label='钱包地址'
          value={<Address address={wallet?.publicKey} />}
          onPress={toPublicKey}
        />
        <ListRow label='修改密码' onPress={toChangePwd} />
        {/* <ListRow label='指纹识别' value='未开启' onPress={toChangeNickname} />
        <ListRow label='人脸识别' value='已开启' onPress={toChangeNickname} /> */}
        <ListRow
          label='备份助记词'
          value={userInfo.maintainPhrase ? '已备份' : ''}
          onPress={toPharse}
        />
        <ListRow
          label='守护者备份'
          value={userInfo.maintainProtector ? '已备份' : ''}
          onPress={toProtector}
        />
        <ListRow
          label='智能隐私备份'
          value={userInfo.maintainQuestion ? '已备份' : ''}
          onPress={toQuestion}
        />
        <ListRow label='退出' onPress={deleteUser} />
      </div>
    </LayoutThird>
  );
}
