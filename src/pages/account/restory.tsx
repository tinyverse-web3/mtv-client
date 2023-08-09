import { useState, useEffect } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import { toast } from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ValidPassword } from '@/components/ValidPassword';

export default function MultiVerify() {
  const nav = useNavigate();
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const { accountInfo, delAccount } = useAccountStore((state) => state);

  const validPasswordSuccess = (password: string) => {};
  const toPharse = async () => {
    if (!accountInfo.hasFeatureData) {
      toast('请先设置加密保险箱');
      return;
    }
    // const loginStatus = await useCheckLogin();
    // if (loginStatus) {
    nav(ROUTE_PATH.ACCOUNT_PHRASE);
    // }·
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
  return (
    <LayoutThird showBack title='恢复途径'>
      <div className='p-4'>
        <ListRow
          label='备份助记词'
          value={accountInfo.maintainPhrase ? '已备份' : ''}
          onPress={toPharse}
        />
        <div className='border-1 border-solid border-gray-2 p-2 rounded-2 mb-6 text-[14px]'>
          助记词非常重要，请妥善保管，注意不使用联网工具备份。
        </div>
        <ListRow
          label='智能隐私备份'
          value={accountInfo.maintainQuestion ? '已备份' : ''}
          onPress={toQuestion}
        />
        <div className='border-1 border-solid border-gray-2 p-2 rounded-2 text-[14px]'>
          智能隐私备份是一种自托管的私钥备份管理，由用户的个人隐私信息，通过MPC-SSS计算生成多个分片，保存在分布式存储网络上，所有计算都在本地完成，所有数据保存在用户自己的数字空间，确保用户数据安全。
          用户务必正确填写以下表格，可以留空不填（数据跟个人信息同步）。如果个人信息有变更，需要重新做账户维护，防止账户丢失。
        </div>
      </div>
      <ValidPassword
        onSuccess={validPasswordSuccess}
        show={showPasswordStatus}
        onClose={() => setShowPasswordStatus(false)}
      />
    </LayoutThird>
  );
}
