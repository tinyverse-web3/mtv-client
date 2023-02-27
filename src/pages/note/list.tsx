import { useEffect, useMemo } from 'react';
import { Text, Container, Card, Button, Spacer } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore, useWalletStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import Page from '@/layout/page';
import { useMtvdbStore } from '@/store';
import { useEvent } from 'react-use';

export default function NoteList() {
  const nav = useNavigate();
  const list = useNoteStore((state) => state.list);
  const remove = useNoteStore((state) => state.remove);
  console.log(list);
  const mtvDb = useMtvdbStore((state) => state.mtvDb);
  const toAdd = () => {
    nav('/note/add');
  };
  const toDetail = (id: string) => {
    nav(`/note/${id}`);
  };
  const removeItem = async (e: any, id: string) => {
    console.log(id);
    e.stopPropagation();
    await remove(id);
  };
  // useEffect(() => {
  //   if (mtvDb) {
  //     mtvDb.get('note').then(console.log);
  //   }
  // }, [mtvDb]);
  return (
    <Page title='记事本'>
      <div className='py-6'>
        {list.map((item) => (
          <div key={item.id}>
            <Card
              onClick={() => toDetail(item.id)}
              isPressable
              variant='bordered'>
              <Card.Body>
                <Text>{item.title}</Text>
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
