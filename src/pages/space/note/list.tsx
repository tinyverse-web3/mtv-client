import { useEffect, useMemo } from 'react';
import { Text, Container, Card, Button, Spacer } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore, useAccountStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import { format } from 'date-fns';
import { useEvent } from 'react-use';
import toast from 'react-hot-toast';

export default function NoteList() {
  const nav = useNavigate();
  const list = useNoteStore((state) => state.list);
  const remove = useNoteStore((state) => state.remove);
  const initNote = useNoteStore((state) => state.init);
  const { account } = useAccountStore((state) => state);
  const toAdd = () => {
    nav('/note/add');
  };
  const toDetail = (id: string) => {
    nav(`/note/${id}`);
  };
  const removeItem = async (e: any, id: string) => {
    e.stopPropagation();
    await remove(id);
  };
  useEffect(() => {
    if (!list?.length) {
      account.getNote().then((content) => {
        if (content) {
          try {
            const list = JSON.parse(content);
            initNote(list);
          } catch (error) {}  
        }
      });
    }
  }, [list]);
  return (
    <LayoutThird
      title='记事本'
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <div onClick={toAdd} className='i-mdi-plus-circle-outline text-5'></div>
      }>
      <div className='p-6'>
        {list.map((item) => (
          <div
            key={item.id}
            className='py-2 px-4 relative border-b border-b-solid border-b-gray-300'>
            <div onClick={() => toDetail(item.id)}>
              <div className='flex items-center'>
                <div className='text-5 i-mdi-file-document-outline mr-1'></div>
                {item.title}
              </div>
              {item.updated && (
                <div>
                  <Text className='text-3'>
                    {format(item.updated, 'yyyy-MM-dd')}
                  </Text>
                </div>
              )}
            </div>
            <div
              className='i-mdi-close absolute right-2 top-1/2 -translate-1/2 w-6 h-6'
              onClick={(e) => removeItem(e, item.id)}></div>
          </div>
        ))}
      </div>
    </LayoutThird>
  );
}
