import { useMemo, useState } from 'react';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAccountStore } from '@/store';
import account from '@/lib/account/account';
import { ValidPassword } from '@/components/ValidPassword';
import { DefaultPasswordModal } from '@/components/DefaultPasswordModal';
import { Image } from '@nextui-org/react';
import { DataStatusBadge } from './components/DataStatusBadge';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react'

const MenuItem = ({ text, icon, onClick }: any) => {
  const { t } = useTranslation();
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    const { code, msg } = await account.uploadAlbum({ file: image });
    e.target.value = '';
    if (code === '000000') {
      toast.success(t('pages.space.photo.upload_success'));
    } else {
      toast.error(msg);
    }
  };
  return (
    <div className='flex flex-col h-full items-center  text-14px'>
      <div className='rounded-full bg-gray-100 p-3 mb-1  flex relative'>
        {text === t('pages.space.data.title') && (
          <DataStatusBadge className='absolute top-5 right-3 rotate-[90deg]' />
        )}
        {text === t('pages.space.photo.title') ? (
          <label className='w-full h-full flex items-center justify-center overflow-hidden'>
            <img
              className={`h-14 w-14 text-gray-600`}
              src={`/space/${icon}`}></img>
            <input
              type='file'
              accept='image/*'
              capture='environment'
              onChange={imageChange}
              className='invisible w-0 h-0'
            />
          </label>
        ) : (
          <img
            onClick={onClick}
            className={`h-14 w-14 text-gray-600 overflow-hidden`}
            src={`/space/${icon}`}></img>
        )}
      </div>
      <span className='text-center text-[12px]'>{text}</span>
    </div>
  );
};
export default function SpaceIndex() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const list = [
    {
      icon: 'icon-note.png',
      label: t('pages.space.note.title'),
      path: ROUTE_PATH.NOTE,
    },
    {
      icon: 'icon-album.png',
      label: t('pages.space.album.title'),
      path: ROUTE_PATH.SPACE_ALBUM,
    },
    {
      icon: 'icon-photo.png',
      label: t('pages.space.photo.title'),
    },
    {
      icon: 'icon-file.png',
      label: t('pages.space.file.title'),
      path: ROUTE_PATH.SPACE_FILE,
    },
    {
      icon: 'icon-password.png',
      label: t('pages.space.password.title'),
      type: 'function',
      handler: () => {
        setShowStatus(true);
      },
    },
    {
      icon: 'icon-gun.png',
      label: t('pages.space.gun.title'),
      path: ROUTE_PATH.SPACE_GUN_LIST,
    },
    {
      icon: 'icon-network.png',
      label: t('pages.space.data.title'),
      path: ROUTE_PATH.SPACE_NETWORK,
    },
    {
      icon: 'icon-read.png',
      label: t('pages.space.read.title'),
    },
    {
      icon: 'icon-ledger.png',
      label: t('pages.space.ledger.title'),
    },
    {
      icon: 'icon-auth.png',
      label: t('pages.space.authenticator.title'),
      path: ROUTE_PATH.SPACE_AUTHENTICATOR,
    },
    {
      icon: 'icon-point.png',
      label: t('pages.space.award.title'),
      path: ROUTE_PATH.ACCOUNT_AWARD,
    },
    {
      icon: 'icon-nft.png',
      label: t('pages.space.nft.title'),
      path: ROUTE_PATH.ASSETS_NFT_ADD,
    },
  ];
  const [showStatus, setShowStatus] = useState(false);
  const menuClick = ({ path, url, label, type, handler }: any) => {
    if (type === 'function') {
      handler();
    } else if (path) {
      nav(path);
    } else if (label === t('pages.space.photo.title')) {
      return;
    } else {
      toast(t('pages.space.hint.coming_soon'));
    }
  };

  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const { accountInfo } = useAccountStore((state) => state);
  const imageSrc = useMemo(() => {
    return accountInfo.avatar
      ? `${apiHost}/sdk/msg/getAvatar?DestPubkey=${accountInfo.publicKey}`
      : '/logo.png';
  }, [accountInfo.avatar]);

  const toAccount = () => {
    nav(ROUTE_PATH.ACCOUNT);
  };

  const toScan = () => {
    nav(ROUTE_PATH.ACCOUNT_SCAN);
  };
  const modalClose = () => {
    setShowStatus(false);
  };
  const validSuccess = () => {
    nav(ROUTE_PATH.SPACE_PASSWORD);
  };
  return (
    <div className='p-6'>
      <div className='flex justify-between mb-6'>
        <div className='flex items-center   ' onClick={toAccount}>
          <Image src={imageSrc} className='w-8 h-8 rounded-full mr-4' />
          <span className='text-blue-500'>{t('pages.space.head_title')}</span>
        </div>
        <div
          className='mdi:line-scan text-7   text-blue-500'
          onClick={toScan}></div>
      </div>

      <div className='grid grid-cols-3 gap-6 justify-items-center'>
        {list.map((v) => (
          <div key={v.label} className=''>
            <MenuItem
              text={v.label}
              icon={v.icon}
              onClick={() => menuClick(v)}
            />
          </div>
        ))}
      </div>
      <DefaultPasswordModal />
      <ValidPassword
        show={showStatus}
        onSuccess={validSuccess}
        onClose={modalClose}
      />
    </div>
  );
}
