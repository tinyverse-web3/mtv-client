import { Avatar } from '@nextui-org/react';
import LayoutTwo from '@/layout/LayoutTwo';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ text }: any) => {
  return (
    <div className='flex flex-col h-full items-center justify-center text-3'>
      <span>{text}</span>
    </div>
  );
};
export default function SpaceIndex() {
  const nav = useNavigate();
  const list = [
    {
      icon: '',
      label: '记事本',
      path: ROUTE_PATH.NOTE,
    },
    {
      icon: '',
      label: '相册',
    },
    {
      icon: '',
      label: '文件',
    },
    {
      icon: '',
      label: '密码本',
    },
    {
      icon: '',
      label: 'GUN',
    },
    {
      icon: '',
      label: '付费阅读',
    },
  ];
  const menuClick = ({ path, url }: any) => {
    if (path) {
      nav(path);
    }
  };
  return (
    <LayoutTwo>
      <div className='grid grid-cols-3 gap-6 justify-items-center pt-10'>
        {list.map((v) => (
          <div className='h-10' onClick={(e) => menuClick(v)}>
            <MenuItem text={v.label} />
          </div>
        ))}
      </div>
    </LayoutTwo>
  );
}
