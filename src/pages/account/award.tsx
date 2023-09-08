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
import { useTranslation } from 'react-i18next';
export default function Award() {
  const { t } = useTranslation();
  const applyDailyReward = async () => {
    const { code, data, msg } = await account.applyDailyReward();
    if (code === '000000') {
      toast.success(t('pages.space.award.apply_success'));
    } else {
      toast.error(msg);
    }
  };
  const applyGuardianReward = async () => {
    const { code, data, msg } = await account.applyGuardianReward();
    if (code === '000000') {
      toast.success(t('pages.space.award.apply_success'));
    } else {
      toast.error(msg);
    }
  };
  return (
    <LayoutThird title={t('pages.space.award.title')}>
      <div className='p-6'>
        <Button
          size='lg'
          className='m-auto mb-4 w-full'
          onPress={applyDailyReward}>
          {t('pages.space.award.daily')}
        </Button>
        <div className='border-1 border-solid border-gray-2 p-2 rounded-2 mb-6 text-[14px]'>
          {t('pages.space.award.hint_one')}
        </div>
        <Button
          size='lg'
          className='m-auto mb-4 w-full'
          onPress={applyGuardianReward}>
          {t('pages.space.award.guardian')}
        </Button>
        <div className='border-1 border-solid border-gray-2 p-2 rounded-2 mb-6 text-[14px]'>
          {t('pages.space.award.hint_two')}
        </div>
        <div className='mt-60 border-1 border-solid border-gray-2 p-2 rounded-2 mb-6 text-[14px]'>
          {t('pages.space.award.hint')}
        </div>
      </div>
    </LayoutThird>
  );
}
