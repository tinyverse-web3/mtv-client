import { useEffect } from 'react';
import { Text } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore, usePasswordStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import PasswordItem from './components/PasswordItem';
import { Empty } from '@/components/Empty';
import { useTranslation } from 'react-i18next';

export default function NoteList() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { list, remove, getList } = usePasswordStore((state) => state);
  const toAdd = () => {
    nav(`${ROUTE_PATH.SPACE_PASSWORD_ADD}?type=add`);
  };
  const toDetail = (id?: string) => {
    nav(`${ROUTE_PATH.SPACE_PASSWORD_ADD}?type=edit&id=${id}`);
  };

  useEffect(() => {
    getList();
  }, []);
  console.log(list);
  return (
    <LayoutThird
      title={t('pages.space.password.title')}
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <div onClick={toAdd} className='i-mdi-plus-circle-outline text-5'></div>
      }>
      <div className='p-4'>
        {list.length ? (
          list.map((item) => (
            <PasswordItem item={item} key={item.Id} toDetail={toDetail} />
          ))
        ) : (
          <Empty />
        )}
      </div>
    </LayoutThird>
  );
}
