import { useEffect } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { Icon } from '@iconify/react';
import { useAwardStore } from '@/store';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CopyIcon } from '@/components/CopyIcon';
import { QRCodeCanvas } from 'qrcode.react';
export default function AwardInvite() {
const { VITE_DOWONLOAD } = import.meta.env;
  const { t } = useTranslation();
  const { list, getInvitationCode, inviteCode } = useAwardStore(
    (state) => state,
  );
  const downloadUrl = 'https://download.tinyverse.space/';
  useEffect(() => {
    getInvitationCode();
  }, []);
  return (
    <LayoutThird title={t('pages.space.award.invite.title')}>
      <div className='p-4 pt-16'>
        <div className='rounded-2xl bg-gray-100 px-4 pb-4 mb-4 pt-16 flex flex-col justify-center text-blue-500 relative'>
          <div className='absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 bg-gray-100 p-4 rounded-full'>
            <img src='/logo.png' className=' w-16 h-16' />
          </div>
          <div className="mb-4 text-center text-sm">{t('pages.space.award.invite.hint')}</div>
          <QRCodeCanvas value={VITE_DOWONLOAD} size={160} className='mb-4 mx-auto'/>
          <div className="mb-4 text-center text-sm">{t('pages.space.award.invite.hint_one')}</div>
          <div className='text-center text-base mb-3'>
            {t('pages.space.award.invite.code_title')}
          </div>
          <div className='relative w-48 mx-auto h-12 flex justify-between items-center rounded-lg bg-gray-200 px-2 mb-3'>
            <div className='w-12'></div>
            <span className='text-orange-400 font-bold text-2xl flex -1'>
              {inviteCode}
            </span>
            <div className='w-12 flex justify-end'>
              <CopyIcon text={inviteCode} />
            </div>
          </div>
          <div className='text-center text-sm mb-2 w-60 mx-auto'>
            {t('pages.space.award.invite.code_hint')}
          </div>
          <div className='bg-gray-200 h-12 rounded-lg flex items-center justify-between px-2 text-blue-500'>
            <span className='text-xs'>{downloadUrl}</span>
            <CopyIcon text={downloadUrl} />
          </div>
        </div>

        {/* <div className='rounded-2xl bg-gray-100 overflow-hidden'>
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
        </div> */}
      </div>
    </LayoutThird>
  );
}
