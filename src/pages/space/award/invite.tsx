import { Empty } from '@/components/Empty';
import LayoutThird from '@/layout/LayoutThird';
import { Icon } from '@iconify/react';
import { useAwardStore } from '@/store';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
export default function AwardInvite() {
  const { t } = useTranslation();
  const { list } = useAwardStore((state) => state);
  const applyDailyReward = async () => {
    const { code, data, msg } = await account.applyDailyReward();
    if (code === '000000') {
      toast.success(t('pages.space.award.apply_success'));
    } else {
      toast.error(msg);
    }
  };
  const toDetail = () => {};
  return (
    <LayoutThird title={t('pages.space.award.title')}>
      <div className='p-4'>
        <div className='rounded-2xl bg-gray-100 px-4 pb-4 mb-4 pt-10 flex flex-col justify-center text-blue-500'>
          <div className='text-center text-base mb-3'>我的邀请码</div>
          <div className='relative h-12 flex justify-between items-center rounded-lg bg-gray-200 px-2 mb-3'>
            <div className='w-12'></div>
            <span className='text-orange-400 font-bold text-2xl flex -1'>
              9Mn6C8
            </span>
            <div className='w-12 flex justify-end'>
              <Icon icon='mdi:content-copy' className='text-xl' />
            </div>
          </div>
          <div className='text-center text-sm mb-2'>
            每成功邀请一位好友，邀请人和被邀请人各奖励50TVS。
          </div>
          <div className='bg-gray-200 h-12 rounded-lg flex items-center justify-between px-2 text-blue-500'>
            <span className='text-xs'> https://download.tinyverse.space/</span>
            <Icon icon='mdi:content-copy' className='text-xl' />
          </div>
        </div>

        <div className='rounded-2xl bg-gray-100 overflow-hidden'>
          <div className='flex text-center text-blue-500 pb-4 pt-6 text-sm bg-gray-200'>
            <div className='w-1/2  flex flex-col justify-center'>
              <span className='mb-4'>邀请收益</span>
              <span>0 TVS</span>
            </div>
            <div className='w-1/2 flex flex-col justify-center '>
              <span className='mb-4'>成功邀请(人数)</span>
              <span>0</span>
            </div>
          </div>
          <div>
            <div className=''>
              <div className='flex items-center h-16 px-4'>
                <Icon icon='mdi:content-copy' className='text-xl mr-4' />
                <div className='flex flex-1 justify-between items-center'>
                  <span className='text-sm'>比方</span>
                  <span className='text-blue-500 mr-4 text-xs'>2023.08.19</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}
