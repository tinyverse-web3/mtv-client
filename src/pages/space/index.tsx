import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MenuItem = ({ text, icon }: any) => {
  return (
    <div className='flex flex-col h-full items-center justify-center text-14px'>
      <div className='rounded-full bg-gray-100 p-3 mb-1'>
        <div className={`${icon} h-14 w-14 text-gray-600`}></div>
      </div>
      <span>{text}</span>
    </div>
  );
};
export default function SpaceIndex() {
  const nav = useNavigate();
  const list = [
    {
      icon: 'i-mdi-notebook-outline',
      label: '记事本',
      path: ROUTE_PATH.NOTE,
    },
    {
      icon: 'i-mdi-image-album',
      label: '相册',
      path: ROUTE_PATH.SPACE_ALBUM,
    },
    {
      icon: 'i-mdi-file-document-outline',
      label: '文件',
      path: ROUTE_PATH.SPACE_FILE,
    },
    {
      icon: 'i-mdi-key-variant',
      label: '密码箱',
      path: ROUTE_PATH.SPACE_PASSWORD,
    },
    {
      icon: 'i-mdi-earth',
      label: 'GUN',
      path: ROUTE_PATH.SPACE_GUN_LIST,
    },
    {
      icon: 'i-mdi-earth',
      label: '网络数据',
      path: ROUTE_PATH.SPACE_NETWORK,
    },
    {
      icon: 'i-mdi-book-open',
      label: '付费阅读',
    },
    {
      icon: 'i-mdi-database-settings-outline',
      label: '账本',
    },
    {
      icon: 'i-mdi-database-settings-outline',
      label: 'Google验证器',
      path: ROUTE_PATH.SPACE_AUTHENTICATOR,
    },
  ];
  const menuClick = ({ path, url }: any) => {
    if (path) {
      nav(path);
    } else {
      toast('即将发布');
    }
  };

  return (
    <div className='grid grid-cols-3 gap-6 justify-items-center pt-10'>
      {list.map((v) => (
        <div key={v.label} className='' onClick={(e) => menuClick(v)}>
          <MenuItem text={v.label} icon={v.icon} />
        </div>
      ))}
    </div>
  );
}
