import { useMemo } from 'react';
import LayoutTwo from '@/layout/LayoutTwo';
import { ROUTE_PATH, routes } from '@/router';
import { useNavigate, matchRoutes, useLocation } from 'react-router-dom';
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
    },
    {
      icon: 'i-mdi-file-document-outline',
      label: '文件',
    },
    {
      icon: 'i-mdi-key-variant',
      label: '密码本',
    },
    {
      icon: 'i-mdi-earth',
      label: 'GUN',
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
      label: '身份验证器',
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
    <LayoutTwo>
      <div className='grid grid-cols-3 gap-6 justify-items-center pt-10'>
        {list.map((v) => (
          <div key={v.label} className='' onClick={(e) => menuClick(v)}>
            <MenuItem text={v.label} icon={v.icon} />
          </div>
        ))}
      </div>
    </LayoutTwo>
  );
}
