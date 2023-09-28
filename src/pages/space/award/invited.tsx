import { useEffect, useState } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function AwardInvite() {
  const { t } = useTranslation();
  const [inviteCode, setInviteCode] = useState('');
  const applyInviterReward = async () => {
    const { code, data, msg } = await account.applyInviterReward(inviteCode);
    if (code === '000000') {
      toast.success(t('pages.space.award.apply_success'));
    } else {
      toast.error(msg);
    }
  };
  return (
    <LayoutThird title={t('pages.space.award.receive.title')}>
      <div className='p-4'>
        <div className='rounded-2xl bg-gray-50 px-4 pb-6 mb-4 pt-10 flex flex-col justify-center text-blue-500'>
          <div className='text-center text-base mb-3'>
            {t('pages.space.award.invite_code')}
          </div>
          <div className='flex flex-col items-center'>
            <Input
              variant='flat'
              isClearable={false}
              className='text-orange-400 w-56 mb-4  text-center'
              classNames={{
                input: 'text-center text-2xl ',
                inputWrapper: 'h-12',
              }}
              value={inviteCode}
              onChange={(v: string) => setInviteCode(v)}></Input>
            <Button
              className=' w-56'
              disabled={!inviteCode}
              onClick={applyInviterReward}>
              {t('pages.space.award.receive.title')}
            </Button>
          </div>
        </div>
        <div className='mt-28 hint-text-box'>{t('pages.space.award.hint_one')}</div>
      </div>
    </LayoutThird>
  );
}
