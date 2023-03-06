import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoteStore } from '@/store';
import { v4 as uuidv4 } from 'uuid';
import Page from '@/layout/page';
import { Text, Container, Row, Button, Textarea } from '@nextui-org/react';
import { ROUTE_PATH } from '@/router';

export default function About() {
  const nav = useNavigate();
  const [note, setNote] = useState('');
  const { id } = useParams();
  const get = useNoteStore((state) => state.get);

  const add = useNoteStore((state) => state.add);
  const update = useNoteStore((state) => state.update);
  const noteChange = (e: any) => {
    setNote(e.target.value);
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
  useEffect(() => {
    getDetail(id);
  }, [id]);
  const addNote = async () => {
    const newNote = await generateNote();
    if (id === 'add') {
      await add(newNote);
    } else if (id) {
      await update(newNote);
    }
    nav(-1);
  };
  return (
    <Page title='记事本' path={ROUTE_PATH.NOTE}>
      <div className='py-8'>
        <Row className='mb-8' justify='center'>
          <Textarea
            fullWidth
            bordered
            value={note}
            maxLength={800}
            onChange={noteChange}
            labelPlaceholder='记事本内容'
            initialValue=''
          />
        </Row>
        <Row className='' justify='center'>
          <Button
            color='secondary'
            className='m-auto mb-6'
            onPress={addNote}
            size='md'>
            确定
          </Button>
        </Row>
      </div>
    </Page>
  );
}
