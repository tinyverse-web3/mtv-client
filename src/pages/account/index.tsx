import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { Address } from '@/components/Address';
import { UserAvatar, ListRow, UserLevel } from './components';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
export default function Account() {
  const nav = useNavigate();
  const { reset: resetGlobal, setLockStatus } = useGlobalStore(
    (state) => state,
  );
  const { accountInfo, delAccount } = useAccountStore((state) => state);

  const toChangePwd = async () => {
    if (!accountInfo.hasFeatureData) {
      toast('请先设置加密保险箱');
      return;
    }
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_CHANGE_PWD);
    }
  };
  const toPublicKey = () => {
    nav(ROUTE_PATH.ACCOUNT_PUBLICKEY);
  };

  const toChangeNickname = async () => {
    nav(ROUTE_PATH.ACCOUNT_NAME);
  };
  const toPharse = async () => {
    if (!accountInfo.hasFeatureData) {
      toast('请先设置加密保险箱');
      return;
    }
    // const loginStatus = await useCheckLogin();
    // if (loginStatus) {
    nav(ROUTE_PATH.ACCOUNT_PHRASE);
    // }
  };
  const toQuestion = async () => {
    if (!accountInfo.hasFeatureData) {
      toast('请先设置加密保险箱');
      return;
    }
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  };
  const toProtector = async () => {
    if (!accountInfo.hasFeatureData) {
      toast('请先设置加密保险箱');
      return;
    }
    const loginStatus = await useCheckLogin();
    console.log('loginStatus', loginStatus);
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_PROTECTOR);
    }
  };
  const toPrivateData = async () => {
    nav(ROUTE_PATH.ACCOUNT_PRIVATEDATA);
  };
  const deleteUser = async () => {
    await resetGlobal();
    await account.lock();
    setLockStatus(true);
    nav(ROUTE_PATH.UNLOCK);
  };
  const toSubAccount = () => {
    nav(ROUTE_PATH.ACCOUNT_SUBACCOUNT_LIST);
  };
  const setupBiometrics = () => {
    window?.JsBridge.setupBiometrics('123', (e: any) => {
      alert(JSON.stringify(e));
      console.log(e);
    });
  };
  return (
    <LayoutThird title='我的资料' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='pt-4 px-4 text-14px'>
        <div className='flex'>
          <UserAvatar className='mr-4' />
          <UserLevel />
        </div>
        <ListRow
          label='名字'
          value={accountInfo.name}
          onPress={toChangeNickname}
        />
        <ListRow
          label='我的公钥'
          value={<Address address={accountInfo.publicKey} />}
          onPress={toPublicKey}
        />
        <ListRow label='修改密码' onPress={toChangePwd} />
        <ListRow label='加密保险箱' onPress={toPrivateData} />
        <ListRow label='指纹识别' value='未开启' onPress={setupBiometrics} />
        <ListRow label='人脸识别' value='已开启' onPress={toChangeNickname} />
        <ListRow
          label='备份助记词'
          value={accountInfo.maintainPhrase ? '已备份' : ''}
          onPress={toPharse}
        />
        <ListRow
          label='守护者备份'
          value={accountInfo.maintainProtector ? '已备份' : ''}
          onPress={toProtector}
        />
        <ListRow
          label='智能隐私备份'
          value={accountInfo.maintainQuestion ? '已备份' : ''}
          onPress={toQuestion}
        />
        <ListRow label='子账号' onPress={toSubAccount} />
        <ListRow label='退出' onPress={deleteUser} />
      </div>
    </LayoutThird>
  );
}
