import { useEffect, useMemo, useState } from 'react';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAccountStore } from '@/store';
import account from '@/lib/account/account';
import { ValidPassword } from '@/components/ValidPassword';
import { DefaultPasswordModal } from '@/components/DefaultPasswordModal';
import { Image } from '@nextui-org/react';
import { DataStatusBadge } from './components/DataStatusBadge';
import { useNativeScan } from '@/lib/hooks';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

const MenuItem = ({ text, icon, onClick, border, status }: any) => {
  return (
    <div className='flex items-center h-12' onClick={onClick}>
      <div className='mr-2'>
        <img
          className={`h-4 w-4 text-gray-600 overflow-hidden`}
          src={`/space/${icon}`}></img>
      </div>
      <div
        className={`flex justify-between items-center h-full flex-1 ${
          border ? 'border-b-1 border-gray-200' : ''
        }`}>
        <div className='text-sm'>{text}</div>
        <div className='flex'>
          {status && <DataStatusBadge className='' />}
          <Icon
            icon='mdi:chevron-right'
            className=' text-2xl text-blue-500 mr-4'></Icon>
        </div>
      </div>
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
      icon: 'icon-photo.png',
      label: t('pages.space.photo.title'),
    },

    {
      icon: 'icon-gun.png',
      label: t('pages.space.gun.title'),
      path: ROUTE_PATH.SPACE_GUN_LIST,
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
      icon: 'icon-point.png',
      label: t('pages.space.award.title'),
      path: ROUTE_PATH.SPACE_AWARD,
    },
    {
      icon: 'icon-nft.png',
      label: t('pages.space.nft.title'),
      path: ROUTE_PATH.ASSETS_NFT_ADD,
    },
  ];
  const dataMenuList = [
    {
      icon: 'icon-password.png',
      label: t('pages.space.password.title'),
      type: 'function',
      handler: () => {
        setShowStatus(true);
      },
    },
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
      icon: 'icon-file.png',
      label: t('pages.space.file.title'),
      path: ROUTE_PATH.SPACE_FILE,
    },
    {
      icon: 'icon-gun.png',
      label: t('pages.space.gun.title'),
      path: ROUTE_PATH.SPACE_GUN_LIST,
    },
  ];
  const toolMenuList = [
    {
      icon: 'icon-auth.png',
      label: t('pages.space.authenticator.title'),
      path: ROUTE_PATH.SPACE_AUTHENTICATOR,
    },
    {
      icon: 'icon-network.png',
      label: t('pages.space.data.title'),
      path: ROUTE_PATH.SPACE_NETWORK,
    },
    // {
    //   icon: 'icon-read.png',
    //   label: t('pages.space.read.title'),
    //   type: 'url',
    //   url: 'https://p2v.tinyverse.space/'
    // },
  ];
  const [showStatus, setShowStatus] = useState(false);
  const menuClick = ({ path, url, label, type, handler }: any) => {
    if (type === 'function') {
      handler();
    } else if (type === 'url') {
      location.href = url;
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
  const { start } = useNativeScan();
  const { accountInfo } = useAccountStore((state) => state);
  const imageSrc = useMemo(() => {
    return accountInfo.avatar
      ? `${apiHost}/sdk/msg/getAvatar?DestPubkey=${accountInfo.publicKey}`
      : '/logo.png';
  }, [accountInfo.avatar]);

  const toAccount = () => {
    nav(ROUTE_PATH.ACCOUNT);
  };
  const toAward = () => {
    nav(ROUTE_PATH.SPACE_AWARD);
  };

  const toScan = () => {
    start();
  };
  const modalClose = () => {
    setShowStatus(false);
  };
  const validSuccess = () => {
    nav(ROUTE_PATH.SPACE_PASSWORD);
  };
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
    <div className='p-4 bg-gray-50'>
      <div className='flex justify-between mb-4'>
        <div className='flex items-center flex-1  ' onClick={toAccount}>
          <Image
            src={imageSrc}
            className='min-w-[2rem] w-8 h-8 rounded-full mr-4'
          />
          <span className='text-blue-500 break-keep'>
            {t('pages.space.head_title')}
          </span>
        </div>
        <div className='flex items-center'>
          <label className='w-full h-full flex items-center justify-center overflow-hidden'>
            <img
              className={`h-6 w-6 text-gray-600`}
              src={`/space/icon-photo.png`}></img>
            <input
              type='file'
              accept='image/*'
              capture='environment'
              onChange={imageChange}
              className='invisible w-0 h-0'
            />
          </label>
          <img
            className={`h-6 w-6 text-gray-600 ml-4`}
            src={`/space/icon-scan.png`}
            onClick={toScan}></img>
        </div>
      </div>

      <div className='mb-4'>
        <img
          className={`w-full bg-gray-600 `}
          src={`/space/banner-one.jpg`}
          onClick={toAward}></img>
      </div>
      <div className='bg-gray-100 rounded-xl overflow-hidden mb-4'>
        <div className='text-md h-8 w-full bg-gray-200 flex items-center px-4 text-blue-500'>
          我的数据
        </div>
        <div className='pl-4'>
          {dataMenuList.map((v, i) => (
            <MenuItem
              key={v.label}
              text={v.label}
              icon={v.icon}
              border={i != dataMenuList.length - 1}
              onClick={() => menuClick(v)}
            />
          ))}
        </div>
      </div>
      <div className='bg-gray-100 rounded-xl overflow-hidden'>
        <div className='text-md h-8 w-full bg-gray-200 flex items-center px-4 text-blue-500'>
          我的工具
        </div>
        <div className='pl-4'>
          {toolMenuList.map((v, i) => (
            <MenuItem
              key={v.label}
              text={v.label}
              icon={v.icon}
              status={i == 1}
              border={i != toolMenuList.length - 1}
              onClick={() => menuClick(v)}
            />
          ))}
        </div>
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
