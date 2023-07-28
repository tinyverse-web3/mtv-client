import { useEffect, useState } from 'react';
import { Text } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import { format } from 'date-fns';
import { Empty } from '@/components/Empty';
import { DelConfirmModel } from '@/components/DelConfirmModel';

export default function NoteList() {
  const nav = useNavigate();
  const [showStatus, setShowStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
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
  useEffect(() => {
    getList();
  }, []);
  return (
    <LayoutThird
      title='记事本'
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <div onClick={toAdd} className='i-mdi-plus-circle-outline text-5'></div>
      }>
      <div className='p-6'>
        {list.length ? (
          list.map((item) => (
            <div
              key={item.Id}
              className='py-2 px-4 relative border-b border-b-solid border-b-gray-300'>
              <div onClick={() => toDetail(item?.Id)}>
                <div className='flex items-center'>
                  <div className='text-5 i-mdi-file-document-outline mr-1'></div>
                  {item.Title}
                </div>
                {item.ModifyTIme && (
                  <div>
                    <Text className='text-3'>
                      {format(new Date(item.ModifyTIme), 'yyyy-MM-dd')}
                    </Text>
                  </div>
                )}
              </div>
              <div
                className='i-mdi-close absolute right-2 top-1/2 -translate-1/2 w-6 h-6 text-red'
                onClick={(e) => removeItem(e, item?.Id)}></div>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
      <DelConfirmModel
        text='记事本'
        show={showStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </LayoutThird>
  );
}
