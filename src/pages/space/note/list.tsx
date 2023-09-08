import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import { format } from 'date-fns';
import { Empty } from '@/components/Empty';
import { DelConfirmModel } from '@/components/DelConfirmModel';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react'

export default function NoteList() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [showStatus, setShowStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  const [loading, setLoading] = useState(false);
  const { list, remove, getList } = useNoteStore((state) => state);
  const toAdd = () => {
    nav('/space/note/add');
  };
  const toDetail = (id?: string) => {
    console.log(id);
    nav(`/space/note/${id}`);
  };
  const removeItem = async (e: any, id?: string) => {
    e.stopPropagation();
    if (id) {
      setShowStatus(true);
      setDelItem(id);
    }
  };
  const delConfirm = async () => {
    await remove(delItem);
  };
  const onClose = async () => {
    setShowStatus(false);
  };
  const getNoteList = async () => {
    if (!list?.length) {
      setLoading(true);
    }
    await getList();
    setLoading(false);
  };
  useEffect(() => {
    getNoteList();
  }, []);
  return (
    <LayoutThird
      title={t('pages.space.note.title')}
      path={ROUTE_PATH.SPACE_INDEX}
      loading={loading}
      rightContent={
        <Icon icon="mdi:plus-circle-outline" onClick={toAdd} className=' text-xl'></Icon>
      }>
      <div className='p-6'>
        {list.length ? (
          list.map((item) => (
            <div
              key={item.Id}
              className='py-2 px-4 relative border-b border-b-solid border-b-gray-300'>
              <div onClick={() => toDetail(item?.Id)}>
                <div className='flex items-center'>
                  <div className='text-5 mdi:file-document-outline mr-1'></div>
                  {item.Title}
                </div>
                {item.ModifyTIme && (
                  <div>
                    <div className='text-3'>
                      {format(new Date(item.ModifyTIme), 'yyyy-MM-dd')}
                    </div>
                  </div>
                )}
              </div>
              <div
                className='mdi:trash-can-outline absolute right-2 top-1/2 -translate-1/2 w-6 h-6 text-red'
                onClick={(e) => removeItem(e, item?.Id)}></div>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
      <DelConfirmModel
        text={t('pages.space.note.title')}
        show={showStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </LayoutThird>
  );
}
