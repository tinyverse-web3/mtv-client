import { Button } from '@/components/form/Button';
// import { useRouter } from 'next/navigation';
import LayoutThird from '@/layout/LayoutThird';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATH } from '@/router';
export default function AwardIndex() {
  const { t } = useTranslation();
  const nav = useNavigate();
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
  const toDetail = () => {
    nav(ROUTE_PATH.SPACE_AWARD_DETAIL);
  };
  return (
    <LayoutThird
      title={t('pages.space.award.title')}
      rightContent={
        <Icon
          icon='material-symbols:more-vert'
          className=' h-6 w-6 '
          onClick={toDetail}
        />
      }>
      <div className='p-4'>
        <div className='text-sm mb-2 text-blue-500'>做任务赚积分</div>
        <div className='rounded-lg bg-gray-100 p-2'>
          <div className='flex items-center h-16'>
            <Icon icon='charm:tick' className='w-10 h-10 mr-2'></Icon>
            <div className='flex-1 flex justify-between items-center text-sm border-b-1 border-gray-200 h-full'>
              <div>
                <p className='mb-2'>{t('pages.space.award.daily')}</p>
                <div className='flex items-center'>
                  <Icon icon='charm:tick' className='w-5 h-5 mr-2'></Icon>
                  <span>+10</span>
                </div>
              </div>
              <Button
                size='xs'
                radius='full'
                className=''
                onPress={applyDailyReward}>
                签到
              </Button>
            </div>
          </div>
          <div className='flex items-center h-16'>
            <Icon icon='charm:tick' className='w-10 h-10 mr-2'></Icon>
            <div className='flex-1 flex justify-between items-center text-sm'>
              <div>
                <p className='mb-2'>{t('pages.space.award.guardian')}</p>
                <div className='flex items-center'>
                  <Icon icon='charm:tick' className='w-5 h-5 mr-2'></Icon>
                  <span>+50</span>
                </div>
              </div>
              <Button
                size='xs'
                radius='full'
                className=''
                onPress={applyGuardianReward}>
                邀请
              </Button>
            </div>
          </div>
          <div className='flex items-center h-16'>
            <Icon icon='charm:tick' className='w-10 h-10 mr-2'></Icon>
            <div className='flex-1 flex justify-between items-center text-sm'>
              <div>
                <p className='mb-2'>接受邀请</p>
                <div className='flex items-center'>
                  <Icon icon='charm:tick' className='w-5 h-5 mr-2'></Icon>
                  <span>+50</span>
                </div>
              </div>
              <Button
                size='xs'
                radius='full'
                className=''
                onPress={applyGuardianReward}>
                被邀请奖励
              </Button>
            </div>
          </div>
          <div className='flex items-center h-16'>
            <Icon icon='charm:tick' className='w-10 h-10 mr-2'></Icon>
            <div className='flex-1 flex justify-between items-center text-sm'>
              <div>
                <p className='mb-2'>创建加密保险箱</p>
                <div className='flex items-center'>
                  <Icon icon='charm:tick' className='w-5 h-5 mr-2'></Icon>
                  <span>+50</span>
                </div>
              </div>
              <Button
                size='xs'
                radius='full'
                className=''
                onPress={applyGuardianReward}>
                签到
              </Button>
            </div>
          </div>
          <div className='flex items-center h-16'>
            <Icon icon='charm:tick' className='w-10 h-10 mr-2'></Icon>
            <div className='flex-1 flex justify-between items-center text-sm'>
              <div>
                <p className='mb-2'>绑定守护者</p>
                <div className='flex items-center'>
                  <Icon icon='charm:tick' className='w-5 h-5 mr-2'></Icon>
                  <span>+10</span>
                </div>
              </div>
              <Button
                size='xs'
                radius='full'
                className=''
                onPress={applyGuardianReward}>
                签到
              </Button>
            </div>
          </div>
          <div className='flex items-center h-16'>
            <Icon icon='charm:tick' className='w-10 h-10 mr-2'></Icon>
            <div className='flex-1 flex justify-between items-center text-sm'>
              <div>
                <p className='mb-2'>{t('pages.space.award.guardian')}</p>
                <div className='flex items-center'>
                  <Icon icon='charm:tick' className='w-5 h-5 mr-2'></Icon>
                  <span>+10</span>
                </div>
              </div>
              <Button
                size='xs'
                radius='full'
                className=''
                onPress={applyGuardianReward}>
                签到
              </Button>
            </div>
          </div>
        </div>
        <div className='mt-60 hint-text-box'>{t('pages.space.award.hint')}</div>
      </div>
    </LayoutThird>
  );
}
