import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '@/components/form/Textarea';
import { v4 as uuidv4 } from 'uuid';
import LayoutThird from '@/layout/LayoutThird';
import { Text, Container, Row, Button } from '@nextui-org/react';
import { useNoteStore, useMtvdbStore } from '@/store';
import { ROUTE_PATH } from '@/router';

export default function Edit() {
  const nav = useNavigate();
  const [note, setNote] = useState('');
  const { id } = useParams();
  const get = useNoteStore((state) => state.get);
  const initNote = useNoteStore((state) => state.init);
  const mtvLoaded = useMtvdbStore((state) => state.loaded);
  const mtvDb = useMtvdbStore((state) => state.mtvDb);
  const add = useNoteStore((state) => state.add);
  const update = useNoteStore((state) => state.update);
  const noteChange = (e: any) => {
    setNote(e?.trim());
  };
  const generateNote = async () => {
    const title = note.substring(0, 10);
    const updated = +new Date();
    const newId = id && id === 'add' ? uuidv4() : id;
    return {
      id: newId as string,
      title,
      content: note,
      updated,
    };
  };
  const getDetail = async (id?: string) => {
    if (id) {
      const detail = (await get(id)) as any;
      setNote(detail?.content);
    }
  };

  const addNote = async () => {
    const newNote = await generateNote();
    if (id === 'add') {
      await add(newNote);
    } else if (id) {
      await update(newNote);
    }
    nav(-1);
  };
  useEffect(() => {
    if (mtvDb?.kvdb && id !== 'add' && mtvLoaded) {
      console.log('mtvLoaded');
      console.log(mtvLoaded);
      mtvDb.get('note').then((res) => {
        console.log(res);
        try {
          const list = JSON.parse(res);
          if (list) {
            initNote(list || []);
            getDetail(id);
          }
        } catch (error) {}
      });
    }
  }, [mtvDb, mtvLoaded, id]);
  return (
    <LayoutThird
      title='记事本'
      path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-6'>
        <Row className='mb-8' justify='center'>
          <Textarea
            value={note}
            maxLength={300}
            onChange={noteChange}
            placeholder='记事本内容'
          />
        </Row>
        <Row className='' justify='center'>
          <Button
            color='secondary'
            disabled={!note}
            className='m-auto mb-6'
            onPress={addNote}
            size='md'>
            确定
          </Button>
        </Row>
      </div>
      </LayoutThird>
  );
}
