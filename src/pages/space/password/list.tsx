import { useEffect } from 'react';
import { Text } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore, usePasswordStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import PasswordItem from './components/PasswordItem';

export default function NoteList() {
  const nav = useNavigate();
  const { list, remove, getList } = usePasswordStore((state) => state);
  const toAdd = () => {
    nav(`${ROUTE_PATH.SPACE_PASSWORD_ADD}?type=add`);
  };
  const toDetail = (id?: string) => {
    console.log(id);
    nav(`${ROUTE_PATH.SPACE_PASSWORD_ADD}?type=add&id=${id}`);
  };
  const removeItem = async (e: any, id?: string) => {
    e.stopPropagation();
    if (id) {
      await remove(id);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  console.log(list)
  return (
    <LayoutThird
      title='密码本'
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <div onClick={toAdd} className='i-mdi-plus-circle-outline text-5'></div>
      }>
      <div className='p-6'>
        {list.map((item) => (
          <PasswordItem item={item} key={item.Id} />
        ))}
      </div>
    </LayoutThird>
  );
}
