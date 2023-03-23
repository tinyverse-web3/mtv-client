import { useEffect, useMemo } from 'react';
import { Text, Container, Card, Button, Spacer } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore, useMtvdbStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import Page from '@/layout/page';
import { format } from 'date-fns';
import { useEvent } from 'react-use';
import toast from 'react-hot-toast';

export default function NoteList() {
  const nav = useNavigate();
  const list = useNoteStore((state) => state.list);
  const remove = useNoteStore((state) => state.remove);
  const initNote = useNoteStore((state) => state.init);
  const mtvLoaded = useMtvdbStore((state) => state.loaded);
  const mtvDb = useMtvdbStore((state) => state.mtvDb);
  const toAdd = () => {
    if (!mtvLoaded) {
      toast.error('存储模块未加载完成，请稍后，或刷新重试');
      return;
    }
    nav('/note/add');
  };
  const toDetail = (id: string) => {
    if (!mtvLoaded) {
      toast.error('存储模块未加载完成，请稍后，或刷新重试');
      return;
    }
    nav(`/note/${id}`);
  };
  const removeItem = async (e: any, id: string) => {
    e.stopPropagation();
    await remove(id);
  };
  useEffect(() => {
    console.log(mtvDb?.kvdb);
    console.log(mtvLoaded);
    if (mtvDb?.kvdb && mtvLoaded) {
      mtvDb.get('note').then((res) => {
        console.log(res);
        try {
          const list = JSON.parse(res);
          if (list) {
            initNote(list || []);
          }
        } catch (error) {}
      });
    }
  }, [mtvDb, mtvLoaded]);
  return (
    <Page title='记事本' path={ROUTE_PATH.HOME}>
      <div className=''>
        {list.map((item) => (
          <div key={item.id}>
            <Card
              onClick={() => toDetail(item.id)}
              isPressable
              variant='bordered'>
              <Card.Body className='py-2 px-4'>
                <Text>{item.title}</Text>
                {item.updated && (
                  <div>
                    <Text className='text-3'>
                      {format(item.updated, 'yyyy-MM-dd')}
                    </Text>
                  </div>
                )}
              </Card.Body>
              <div
                className='i-mdi-close absolute right-2 top-1/2 -translate-1/2 w-6 h-6'
                onClick={(e) => removeItem(e, item.id)}></div>
            </Card>
            <Spacer y={1} />
          </div>
        ))}
        <Button
          color='secondary'
          className='m-auto mb-6'
          onPress={toAdd}
          size='md'>
          新增
        </Button>
      </div>
    </Page>
  );
}
