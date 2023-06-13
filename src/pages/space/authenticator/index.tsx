import { useMemo } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH, routes } from '@/router';
import { useNavigate, matchRoutes, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function SpaceIndex() {
  const nav = useNavigate();
  const list: any[] = [
    {
      label: 'Google',
      code: 378899,
    },
    {
      label: 'mtv',
      code: 378899,
    },
  ];
  const itemClick = ({ path, url }: any) => {};
  const toAdd = () => {
    nav(ROUTE_PATH.SPACE_AUTHENTICATOR_ADD);
  };
  return (
    <LayoutThird
      title='身份验证器'
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <div onClick={toAdd} className='i-mdi-plus-circle-outline text-5'></div>
      }>
      <div className='px-6'>
        {list.map((v) => (
          <div
            key={v.label}
            className='h-18 border-b-gray-200 border-b-solid border-b flex items-center hover:bg-gray-100 cursor-pointer px-2'
            onClick={(e) => itemClick(v)}>
            <div className='flex justify-between items-center w-full'>
              <div>
                <div className='text-6'>{v.label}</div>
                <div>{v.code}</div>
              </div>
              <svg viewBox='0 0 100 100' className='circular-progress'>
                <path
                  className='circular-progress-bar'
                  d='M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98'
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </LayoutThird>
  );
}
