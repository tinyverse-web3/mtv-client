import LayoutThird from '@/layout/LayoutThird';
import { useEffect } from 'react';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore, useWalletStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { Address } from '@/components/Address';
import { UserAvatar, ListRow, UserLevel } from './components';
import { useRequest } from '@/api';

export default function Account() {
  const nav = useNavigate();
  const {
    userInfo,
    setUserInfo,
    maintainPhrase,
    maintainProtector,
    maintainQuestion,
  } = useGlobalStore((state) => state);
  const { wallet } = useWalletStore((state) => state);

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
          value={maintainPhrase ? '已备份' : ''}
          onPress={toPharse}
        />
        <ListRow
          label='守护者备份'
          value={maintainProtector ? '已备份' : ''}
          onPress={toProtector}
        />
        <ListRow
          label='智能隐私备份'
          value={maintainQuestion ? '已备份' : ''}
          onPress={toQuestion}
        />
      </div>
    </LayoutThird>
  );
}
