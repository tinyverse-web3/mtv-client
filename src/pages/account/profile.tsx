import React, { useEffect, useMemo, useRef } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { QRCodeCanvas } from 'qrcode.react';
import LayoutThird from '@/layout/LayoutThird';
import { useChatStore, useAccountStore } from '@/store';
import { CopyIcon } from '@/components/CopyIcon';
import { useTranslation } from 'react-i18next';
import { QrType } from '@/type';
import { download } from '@/lib/utils';
import { UserAvatar } from './components/UserAvatar';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';

const Profile: React.FC = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const qrBoxRef = useRef<any>();
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
  const toGun = () => {
    nav(ROUTE_PATH.SPACE_GUN_LIST);
  };
  const shortHandler = (str?: string) => {
    if (str) {
      return `${str?.substring(0, 10)}*****${str?.substring(str?.length - 10)}`;
    }
    return '';
  };
  const shortAddress = useMemo(() => {
    return shortHandler(accountInfo.address);
  }, [accountInfo.address]);
  const shortMessage = useMemo(() => {
    return shortHandler(accountInfo.messageKey);
  }, [accountInfo.messageKey]);
  const shortKey = useMemo(() => {
    return shortHandler(accountInfo.publicKey);
  }, [accountInfo.publicKey]);
  return (
    <LayoutThird title={t('pages.account.profile.title')}>
      <div className='p-4 h-full overflow-y-auto'>
        <div className='pt-10 mb-4'>
          <Card className='overflow-visible'>
            <CardBody className='overflow-visible'>
              <div className='pt-10 relative px-2'>
                <div className='flex items-center absolute -top-16 left-1/2 transfrom -translate-x-1/2  rounded-full bg-white w-24 h-24 p-2'>
                  <UserAvatar />
                </div>
                <div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.gun')}</div>
                    <Card>
                      <CardBody className='break-all p-2'>
                        <div onClick={toGun}>
                          {accountInfo.name ||
                            t('pages.account.profile.unset_text')}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.public_key')}</div>
                    <Card>
                      <CardBody className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>{shortKey}</div>
                          <CopyIcon
                            text={accountInfo.publicKey}
                            className='ml-4'
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.message_key')}</div>
                    <Card>
                      <CardBody className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>{shortMessage}</div>
                          <CopyIcon
                            text={accountInfo.messageKey}
                            className='ml-4'
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.wallet_key')}</div>
                    <Card>
                      <CardBody className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>{shortAddress}</div>
                          <CopyIcon
                            text={accountInfo.address}
                            className='ml-4'
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardBody className='break-all'>
            <div className='flex flex-col items-center' ref={qrBoxRef}>
              <QRCodeCanvas value={qrcodeValue} size={200} />
              <div className='mt-2'>
                {t('pages.account.profile.qrcode_add')}
              </div>
              <div
                className='text-blue-600 underline underline-solid text-center '
                onClick={loadQrcode}>
                {t('pages.account.profile.save_qrcode')}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </LayoutThird>
  );
};

export default Profile;
