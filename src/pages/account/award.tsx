import { Text, Link } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
// import { useRouter } from 'next/navigation';
import LayoutThird from '@/layout/LayoutThird';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAccountStore, useGlobalStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
export default function Award() {
  const applyDailyReward = async () => {
    const { code, data, msg } = await account.applyDailyReward();
    if (code === '000000') {
      toast.success('申请已提交');
    } else {
      toast.error(msg);
    }
  };
  const applyGuardianReward = async () => {
    const { code, data, msg } = await account.applyGuardianReward();
    if (code === '000000') {
      toast.success('申请已提交');
    } else {
      toast.error(msg);
    }
  };
  return (
    <LayoutThird title="获取奖励积分">
      <div className='p-6'>
        <Button
          size='lg'
          className='m-auto mb-4 w-full'
          onPress={applyDailyReward}>
          获取每日积分
        </Button>
        <Button
          size='lg'
          className='m-auto mb-4 w-full'
          onPress={applyGuardianReward}>
          获取守护者积分
        </Button>
      </div>
    </LayoutThird>
  );
}
