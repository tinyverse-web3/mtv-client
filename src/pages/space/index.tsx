import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
import { text } from 'stream/consumers';
const MenuItem = ({ text, icon, onClick }: any) => {
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    const { code, msg } = await account.uploadAlbum({ file: image });

    if (code === '000000') {
      toast.success('拍照成功');
    } else {
      toast.error(msg);
    }
  };
  return (
    <div className='flex flex-col h-full items-center justify-center text-14px'>
      <div className='rounded-full bg-gray-100 p-3 mb-1 overflow-hidden flex'>
        {text === '拍照' ? (
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

      <span>{text}</span>
    </div>
  );
};
export default function SpaceIndex() {
  const nav = useNavigate();
  const list = [
    {
      icon: 'icon-note.png',
      label: '记事本',
      path: ROUTE_PATH.NOTE,
    },
    {
      icon: 'icon-album.png',
      label: '相册',
      path: ROUTE_PATH.SPACE_ALBUM,
    },
    {
      icon: 'icon-photo.png',
      label: '拍照',
    },
    {
      icon: 'icon-file.png',
      label: '文件',
      path: ROUTE_PATH.SPACE_FILE,
    },
    {
      icon: 'icon-password.png',
      label: '密码箱',
      path: ROUTE_PATH.SPACE_PASSWORD,
    },
    {
      icon: 'icon-gun.png',
      label: 'GUN',
      path: ROUTE_PATH.SPACE_GUN_LIST,
    },
    {
      icon: 'icon-network.png',
      label: '网络数据',
      path: ROUTE_PATH.SPACE_NETWORK,
    },
    {
      icon: 'icon-read.png',
      label: '付费阅读',
    },
    {
      icon: 'icon-ledger.png',
      label: '账本',
    },
    {
      icon: 'icon-auth.png',
      label: 'Google验证器',
      path: ROUTE_PATH.SPACE_AUTHENTICATOR,
    },
    {
      icon: 'icon-point.png',
      label: '获得积分',
    },
  ];
  const menuClick = ({ path, url, label }: any) => {
    console.log(label);
    if (path) {
      nav(path);
    } else if (label === '拍照') {
      return;
    } else {
      toast('即将发布');
    }
  };

  return (
    <div className='grid grid-cols-3 gap-6 justify-items-center pt-10'>
      {list.map((v) => (
        <div key={v.label} className=''>
          <MenuItem text={v.label} icon={v.icon} onClick={() => menuClick(v)} />
        </div>
      ))}
    </div>
  );
}
