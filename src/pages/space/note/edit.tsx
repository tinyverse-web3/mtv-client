import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '@/components/form/Textarea';
import { v4 as uuidv4 } from 'uuid';
import LayoutThird from '@/layout/LayoutThird';
import { Text, Container, Row, Button } from '@nextui-org/react';
import { useNoteStore, useAccountStore } from '@/store';
import { ROUTE_PATH } from '@/router';

export default function Edit() {
  const nav = useNavigate();
  const [note, setNote] = useState('');
  const { id } = useParams();
  const {
    get: getNoteById,
    add,
    update,
  } = useNoteStore((state) => state);

  const { account } = useAccountStore(state => state)
  const noteChange = (e: any) => {
    setNote(e?.trim());
  };
  const generateNote = async () => {
    const title = note.substring(0, 10);
    return {
      Id: id,
      Title: title,
      Content: note,
    };
  };
  const getDetail = async (id?: string) => {
    if (id) {
      const detail = (await getNoteById(id)) as any;
      setNote(detail?.Content);
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
      getDetail(id);
  }, [id]);
  return (
    <LayoutThird title='记事本'>
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
