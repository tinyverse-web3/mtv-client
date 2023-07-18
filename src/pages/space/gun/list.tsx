import { useEffect, useMemo } from 'react';
import { Text, Container, Card, Button, Spacer } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import { format } from 'date-fns';
import { useEvent } from 'react-use';
import toast from 'react-hot-toast';
import { useGunStore, EMPTY_GUN_NAME } from '@/store';
import { GunItem } from './components/GunItem';

export default function GunListShow() {
  const nav = useNavigate();
  const { list, load: loadGUN } = useGunStore((state) => state);
  const remove = useGunStore((state) => state.remove);
  //const mtvStorage = useMtvStorageStore((state) => state.mtvStorage);
  const toAdd = () => {
    nav(ROUTE_PATH.SPACE_GUN_APPLY);
  };
  const toDetail = (key: string) => {
    console.log(' The key is', key);
    if (key != EMPTY_GUN_NAME) {
      nav(`/space/gun/detail/${key}`);
    }
  };
  const removeItem = async (e: any, id: string) => {
    e.stopPropagation();
    await remove(id);
  };
  useEffect(() => {
    if (!list?.length) {
      // Should load GUN list first in page init
      loadGUN();
    }
  }, [list]);

  return (
    <LayoutThird
      title='你拥有的GUN域名'
      rightContent={
        <div onClick={toAdd} className='i-mdi-plus-circle-outline text-5'></div>
      }>
      <div className='pt-1 px-6'>
        {list.map((item) => (
          <div
            key={item.key}
            className='py-2 relative border-b border-b-solid border-b-gray-300'>
            <div onClick={() => toDetail(item.name)}>
              <GunItem
                key={item.key}
                name={item.name}
                expired={item.expired}
                owner={item.owner}
              />
            </div>
          </div>
        ))}
      </div>
    </LayoutThird>
  );
}
