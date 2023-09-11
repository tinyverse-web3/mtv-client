import React, { useEffect, useMemo, useRef } from 'react';
import { Card, CardBody } from '@nextui-org/react';
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
  const [profile, setProfile] = React.useState<any>({
    avatar: '',
    gunname: '',
    messagekey: '',
    nickname: '',
    publickey: '',
    walletkey: '',
  });
  const getProfile = async () => {
    const { code, data, msg } = await account.getMsgProfile(
      accountInfo.publicKey,
    );
    if (code === '000000') {
      setProfile(data);
    } else {
      toast.error(msg);
    }
  };
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
  useEffect(() => {
    if (accountInfo.publicKey) {
      getProfile();
    }
  }, [accountInfo.publicKey]);
  const imageSrc = useMemo(() => {
    return accountInfo.avatar
      ? `${apiHost}/sdk/msg/getAvatar?DestPubkey=${accountInfo.publicKey}`
      : '/logo.png';
  }, [accountInfo.avatar]);
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
                        <div>
                          {profile.gunname ||
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
                          <div className='break-all flex-1'>
                            {profile.publickey}
                          </div>
                          <CopyIcon text={profile.publickey} className='ml-4' />
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.message_key')}</div>
                    <Card>
                      <CardBody className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>
                            {profile.messagekey}
                          </div>
                          <CopyIcon
                            text={profile.messagekey}
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
                          <div className='break-all flex-1'>
                            {profile.walletkey}
                          </div>
                          <CopyIcon text={profile.walletkey} className='ml-4' />
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
                className=' text-blue-9 underline underline-solid text-center '
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
