import React, { useEffect, useMemo, useRef } from 'react';
import { Image, Button as NextButton, Card } from '@nextui-org/react';
import { QRCodeCanvas } from 'qrcode.react';
import LayoutThird from '@/layout/LayoutThird';
import { useChatStore, useAccountStore } from '@/store';
import { toast } from 'react-hot-toast';
import { CopyIcon } from '@/components/CopyIcon';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';
import { QrType } from '@/type';
import { download } from '@/lib/utils';
import { UserAvatar } from './components/UserAvatar';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const qrBoxRef = useRef<any>();
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const { accountInfo } = useAccountStore((state) => state);

  const qrcodeValue = useMemo(() => {
    if (!accountInfo.publicKey) return '';
    return `type=${QrType.ADD_FRIEND}&value=${accountInfo.publicKey}`;
  }, [accountInfo.publicKey]);
  const loadQrcode = () => {
    if (qrBoxRef.current) {
      const canvas = qrBoxRef.current.querySelector('canvas');
      const url = canvas?.toDataURL();
      if (url) {
        download(url, `qrcode_${accountInfo.publicKey}.png`);
      }
    }
  };
  const imageSrc = useMemo(() => {
    return accountInfo.avatar
      ? `${apiHost}/sdk/msg/getAvatar?DestPubkey=${accountInfo.publicKey}`
      : '/logo.png';
  }, [accountInfo.avatar]);
  return (
    <LayoutThird title={t('pages.account.profile.title')}>
      <div className='p-4 h-full overflow-y-auto'>
        <div className='pt-10 mb-4'>
          <Card variant='bordered' className='overflow-unset'>
            <Card.Body className='overflow-unset'>
              <div className='pt-10 relative px-2'>
                <div className='flex items-center absolute -top-4 left-1/2 -translate-1/2 rounded-full bg-white w-26 h-26 p-2'>
                  <UserAvatar />
                </div>
                <div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.gun')}</div>
                    <Card variant='bordered'>
                      <Card.Body className='break-all p-2'>
                        <div>
                          {accountInfo.name||
                            t('pages.account.profile.unset_text')}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.public_key')}</div>
                    <Card variant='bordered'>
                      <Card.Body className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>
                            {accountInfo.publicKey}
                          </div>
                          <CopyIcon text={accountInfo.publicKey} className='ml-4' />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.message_key')}</div>
                    <Card variant='bordered'>
                      <Card.Body className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>
                            {accountInfo.messageKey}
                          </div>
                          <CopyIcon
                            text={accountInfo.messageKey}
                            className='ml-4'
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.wallet_key')}</div>
                    <Card variant='bordered'>
                      <Card.Body className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>
                            {accountInfo.address}
                          </div>
                          <CopyIcon text={accountInfo.address} className='ml-4' />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <Card variant='bordered'>
          <Card.Body className='break-all'>
            <div className='text-center' ref={qrBoxRef}>
              <QRCodeCanvas value={qrcodeValue} size={200} />
              <div className='mt-2'>
                {t('pages.account.profile.qrcode_add')}
              </div>
              <div
                className='cursor-pointer text-blue-9 underline underline-solid text-center '
                onClick={loadQrcode}>
                {t('pages.account.profile.save_qrcode')}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </LayoutThird>
  );
};

export default Profile;
