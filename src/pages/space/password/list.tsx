import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore, usePasswordStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import PasswordItem from './components/PasswordItem';
import { Empty } from '@/components/Empty';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

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
        <Icon
          onClick={toAdd}
          icon='mdi:plus-circle-outline'
          className='text-2xl'/>
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
