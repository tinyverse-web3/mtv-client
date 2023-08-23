import React, { useEffect, useMemo } from 'react';
import { Image, Button as NextButton, Card } from '@nextui-org/react';
import { QRCodeCanvas } from 'qrcode.react';
import LayoutThird from '@/layout/LayoutThird';
import { useChatStore, useAccountStore } from '@/store';
import { toast } from 'react-hot-toast';
import { CopyIcon } from '@/components/CopyIcon';
import account from '@/lib/account/account';
import { useNavigate } from 'react-router-dom';
import { QrType } from '@/type';

const Profile: React.FC = () => {
  const nav = useNavigate();
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
    <LayoutThird title='我的名片'>
      <div className='p-4 h-full overflow-y-auto'>
        <div className='pt-16 mb-4'>
          <Card variant='flat' className='overflow-unset'>
            <Card.Body className='overflow-unset'>
              <div className='pt-10 relative px-2'>
                <div className='flex items-center absolute -top-4 left-1/2 -translate-1/2 rounded-full bg-white w-26 h-26 p-6'>
                  <Image src={imageSrc} className='rounded w-full' />
                </div>
                <div>
                  <div className='mb-4'>
                    <div className='mb-2'>GUN</div>
                    <Card variant='bordered'>
                      <Card.Body className='break-all p-2'>
                        <div>{profile.gunname || '未设置'}</div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>公钥</div>
                    <Card variant='bordered'>
                      <Card.Body className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>
                            {profile.publickey}
                          </div>
                          <CopyIcon text={profile.publickey} className='ml-4' />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>消息公钥</div>
                    <Card variant='bordered'>
                      <Card.Body className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>
                            {profile.messagekey}
                          </div>
                          <CopyIcon
                            text={profile.messagekey}
                            className='ml-4'
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>钱包公钥</div>
                    <Card variant='bordered'>
                      <Card.Body className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>
                            {profile.walletkey}
                          </div>
                          <CopyIcon text={profile.walletkey} className='ml-4' />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <Card>
          <Card.Body className='break-all'>
            <div className='text-center'>
              <QRCodeCanvas value={qrcodeValue} size={200} />
              <div className='mt-2'>扫描二维码，加我为好友。</div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </LayoutThird>
  );
};

export default Profile;
