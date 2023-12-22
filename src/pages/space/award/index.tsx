import { useState } from 'react';
import { Button } from '@/components/form/Button';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useAccountStore, useAwardStore } from '@/store';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATH } from '@/router';
import { useEffect, useMemo } from 'react';
import IconDaily from '@/assets/images/reward/icon-daily.png';
import IconInvite from '@/assets/images/reward/icon-invite.png';
import IconInvited from '@/assets/images/reward/icon-invited.png';
import { ValidPassword } from '@/components/ValidPassword';
import IconValut from '@/assets/images/reward/icon-valut.png';
import IconGuardian from '@/assets/images/reward/icon-guardian.png';
export default function AwardIndex() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [type, setType] = useState(0);
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const { getRewardStatusList, statusMap } = useAwardStore((state) => state);
  const { accountInfo } = useAccountStore((state) => state);
  const applyDailyReward = async () => {
    const { code, data, msg } = await account.applyDailyReward();
    if (code === '000000') {
      toast.success(t('pages.space.award.apply_success'));
    } else {
      toast.error(msg);
    }
  };
  const applyVaultReward = async () => {
    const { code, data, msg } = await account.applyVaultReward();
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
  const dailyStep = useMemo<number>(() => {
    return statusMap[7]?.status ? 1 : 0;
  }, [statusMap[7]?.status]);
  const invitedStep = useMemo<number>(() => {
    return statusMap[4]?.status ? 1 : 0;
  }, [statusMap[4]?.status]);
  const vaultStep = useMemo<number>(() => {
    return accountInfo.hasFeatureData ? (statusMap[0]?.status ? 2 : 1) : 0;
  }, [accountInfo.hasFeatureData, statusMap[0]?.status]);
  const guardianStep = useMemo<number>(() => {
    return accountInfo.bindStatus ? (statusMap[1]?.status ? 2 : 1) : 0;
  }, [accountInfo.bindStatus, statusMap[1]?.status]);

  const vaultHandler = async () => {
    if (vaultStep === 0) {
      setType(1);
      setShowPasswordStatus(true);
    } else if (vaultStep === 1) {
      await applyVaultReward();
    }
  };
  const guardianHandler = async () => {
    if (guardianStep === 0) {
      setType(2);
      setShowPasswordStatus(true);
    } else if (guardianStep === 1) {
      await applyGuardianReward();
    }
  };
  const invitedHandler = async () => {
    if (invitedStep === 0) {
      nav(ROUTE_PATH.SPACE_AWARD_INVITED);
    }
  };
  const validPasswordSuccess = (password: string) => {
    if (type === 1) {
      nav(ROUTE_PATH.ACCOUNT_PRIVATEDATA);
      // toMultiVerify();
    } else if (type === 2) {
      // toRestory();
      nav(ROUTE_PATH.ACCOUNT_PROTECTOR_ADD);
    }
  };
  const toDetail = () => {
    nav(ROUTE_PATH.SPACE_AWARD_DETAIL);
  };
  const toInvite = () => {
    nav(ROUTE_PATH.SPACE_AWARD_INVITE);
  };
  useEffect(() => {
    getRewardStatusList();
  }, []);
  console.log(statusMap);
  return (
    <LayoutThird
      title={t('pages.space.award.title')}
      rightContent={
        <div className='flex justify-end items-center p-2' onClick={toDetail}>
          <Icon icon='material-symbols:more-vert' className=' h-6 w-6 ' />
        </div>
        // <Popover backdrop='transparent'>
        //   <PopoverTrigger>
        //     <div className='flex justify-end items-center p-2'>
        //       <Icon icon='material-symbols:more-vert' className=' h-6 w-6 ' />
        //     </div>
        //   </PopoverTrigger>
        //   <PopoverContent>
        //     <div className='px-1 py-2'>
        //       <div
        //         className='text-small py-2 border-b-1 border-gray-100'
        //         onClick={toDetail}>
        //         {t('pages.space.award.detail.title')}
        //       </div>
        //       {/* <div className='text-small py-2 '>
        //         {t('pages.space.award.contract.title')}
        //       </div> */}
        //     </div>
        //   </PopoverContent>
        // </Popover>
      }>
      <div className='p-4'>
        <div className='text-sm mb-2 text-blue-500'>
          {t('pages.space.award.index_title')}
        </div>
        <div className='rounded-lg bg-gray-50 p-2'>
          <div className='flex items-center'>
            <img src={IconDaily} className='w-10 h-10 mr-4'></img>
            <div className='flex-1 flex justify-between items-center text-sm border-b-1 border-gray-200 h-full  py-2'>
              <div>
                <p className='mb-2'>{t('pages.space.award.index_daily')}</p>
                <div className='flex items-center'>
                  <Icon
                    icon='streamline:shopping-gift-reward-box-social-present-gift-media-rating-bow'
                    className='w-4 h-4 text-blue-500 mr-2'></Icon>
                  <span>+{statusMap[7]?.score}</span>
                </div>
              </div>
              <div>
                <Button
                  size='sm'
                  radius='full'
                  className='text-xs'
                  onPress={applyDailyReward}>
                  {dailyStep == 0 && t('pages.space.award.daily_button_one')}
                  {dailyStep == 1 && t('pages.space.award.index_button_three')}
                </Button>
                {dailyStep == 1 && (
                  <p className='text-xs text-center mt-1 text-gray-600'>
                    {t('pages.space.award.daily_button_two')}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center'>
            <img src={IconInvite} className='w-10 h-10 mr-4'></img>
            <div className='flex-1 flex justify-between items-center text-sm border-b-1 border-gray-200 h-full  py-2'>
              <div>
                <p className='mb-2'>{t('pages.space.award.index_invite')}</p>
                <div className='flex items-center'>
                  <Icon
                    icon='streamline:shopping-gift-reward-box-social-present-gift-media-rating-bow'
                    className='w-4 h-4  text-blue-500 mr-2'></Icon>
                  <span>+{Math.ceil(statusMap[4]?.score / 2)}</span>
                </div>
              </div>
              <Button
                size='sm'
                radius='full'
                className='text-xs'
                onPress={toInvite}>
                {t('pages.space.award.invite_button')}
              </Button>
            </div>
          </div>
          <div className='flex items-center'>
            <img src={IconInvited} className='w-10 h-10 mr-4'></img>
            <div className='flex-1 flex justify-between items-center text-sm border-b-1 border-gray-200 h-full py-2'>
              <div>
                <p className='mb-2'>{t('pages.space.award.index_invited')}</p>
                <div className='flex items-center'>
                  <Icon
                    icon='streamline:shopping-gift-reward-box-social-present-gift-media-rating-bow'
                    className='w-4 h-4  text-blue-500 mr-2'></Icon>
                  <span>+{Math.ceil(statusMap[4]?.score / 2)}</span>
                </div>
              </div>
              <Button
                size='sm'
                radius='full'
                className='text-xs'
                onPress={invitedHandler}>
                {invitedStep === 1 && t('pages.space.award.index_button_three')}
                {invitedStep === 0 && t('pages.space.award.invited_button')}
              </Button>
            </div>
          </div>
          <div className='flex items-center'>
            <img src={IconValut} className='w-10 h-10 mr-4'></img>
            <div className='flex-1 flex justify-between items-center text-sm border-b-1 border-gray-200 h-full py-2'>
              <div>
                <p className='mb-2'>{t('pages.space.award.index_valut')}</p>
                <div className='flex items-center'>
                  <Icon
                    icon='streamline:shopping-gift-reward-box-social-present-gift-media-rating-bow'
                    className='w-4 h-4  text-blue-500 mr-2'></Icon>
                  <span>+{statusMap[0]?.score}</span>
                </div>
              </div>
              <Button
                size='sm'
                radius='full'
                className='text-xs'
                onPress={vaultHandler}>
                {vaultStep === 0 && t('pages.space.award.index_button_one')}
                {vaultStep === 1 && t('pages.space.award.index_button_two')}
                {vaultStep === 2 && t('pages.space.award.index_button_three')}
              </Button>
            </div>
          </div>
          <div className='flex items-center'>
            <img src={IconGuardian} className='w-10 h-10 mr-4'></img>
            <div className='flex-1 flex justify-between items-center text-sm h-full  py-2'>
              <div>
                <p className='mb-2'>{t('pages.space.award.index_guardian')}</p>
                <div className='flex items-center'>
                  <Icon
                    icon='streamline:shopping-gift-reward-box-social-present-gift-media-rating-bow'
                    className='w-4 h-4  text-blue-500 mr-2'></Icon>
                  <span>+{statusMap[1]?.score}</span>
                </div>
              </div>
              <Button
                size='sm'
                className='text-xs'
                radius='full'
                onPress={guardianHandler}>
                {guardianStep === 0 && t('pages.space.award.index_button_one')}
                {guardianStep === 1 && t('pages.space.award.index_button_two')}
                {guardianStep === 2 &&
                  t('pages.space.award.index_button_three')}
              </Button>
            </div>
          </div>
        </div>
        <ValidPassword
          onSuccess={validPasswordSuccess}
          show={showPasswordStatus}
          onClose={() => setShowPasswordStatus(false)}
        />
        <div className='mt-28 hint-text-box'>{t('pages.space.award.hint')}</div>
      </div>
    </LayoutThird>
  );
}
