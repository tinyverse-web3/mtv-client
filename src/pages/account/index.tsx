import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { Address } from '@/components/Address';
import { UserAvatar, ListRow, UserLevel } from './components';
import { toast } from 'react-hot-toast';

export default function Account() {
  const nav = useNavigate();
  const { reset: resetGlobal } = useGlobalStore((state) => state);
  const { account } = useAccountStore((state) => state);

  const toChangePwd = () => {
    nav(ROUTE_PATH.ACCOUNT_CHANGE_PWD);
  };
  const toPublicKey = () => {
    nav(ROUTE_PATH.ACCOUNT_PUBLICKEY);
  };

  const toChangeNickname = async () => {
    if (!account.accountInfo.featureData) {
      toast('请先设置加密保险箱');
      return;
    }
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_NAME);
    }
  };
  const toPharse = async () => {
    if (!account.accountInfo.featureData) {
      toast('请先设置加密保险箱');
      return;
    }
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_PHRASE);
    }
  };
  const toQuestion = async () => {
    if (!account.accountInfo.featureData) {
      toast('请先设置加密保险箱');
      return;
    }
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  };
  const toProtector = async () => {
    if (!account.accountInfo.featureData) {
      toast('请先设置加密保险箱');
      return;
    }
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_PROTECTOR);
    }
  };
  const toPrivateData = async () => {
    nav(ROUTE_PATH.ACCOUNT_PRIVATEDATA);
  };
  const deleteUser = async () => {
    await Promise.all([resetGlobal(), account.remove()]);
    localStorage.clear();
    location.reload();
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
          value={account.accountInfo.name}
          onPress={toChangeNickname}
        />
        <ListRow
          label='我的公钥'
          value={<Address address={account.accountInfo.publicKey} />}
          onPress={toPublicKey}
        />
        <ListRow label='修改密码' onPress={toChangePwd} />
        <ListRow label='加密保险箱' onPress={toPrivateData} />
        {/* <ListRow label='指纹识别' value='未开启' onPress={toChangeNickname} />
        <ListRow label='人脸识别' value='已开启' onPress={toChangeNickname} /> */}
        <ListRow
          label='备份助记词'
          value={account.accountInfo.maintainPhrase ? '已备份' : ''}
          onPress={toPharse}
        />
        <ListRow
          label='守护者备份'
          value={account.accountInfo.maintainProtector ? '已备份' : ''}
          onPress={toProtector}
        />
        <ListRow
          label='智能隐私备份'
          value={account.accountInfo.maintainQuestion ? '已备份' : ''}
          onPress={toQuestion}
        />
        <ListRow label='退出' onPress={deleteUser} />
      </div>
    </LayoutThird>
  );
}
