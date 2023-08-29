import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '@/components/form/Textarea';
import LayoutThird from '@/layout/LayoutThird';
import { Row, Button } from '@nextui-org/react';
import { useNoteStore } from '@/store';
import { useTranslation } from 'react-i18next';

export default function Edit() {
  const { t }  = useTranslation();
  const nav = useNavigate();
  const [note, setNote] = useState('');
  const { id } = useParams();
  const {
    get: getNoteById,
    add,
    update,
  } = useNoteStore((state) => state);

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
    <LayoutThird title={t('pages.space.note.title')}>
      <div className='p-6'>
        <Row className='mb-8' justify='center'>
          <Textarea
            value={note}
            minRows={20}
            maxRows={100}
            onChange={noteChange}
            placeholder={t('pages.space.note.input_placeholder')}
          />
        </Row>
        <Row className='' justify='center'>
          <Button
            color='secondary'
            disabled={!note}
            className='m-auto mb-6'
            onPress={addNote}
            size='md'>
            {t('common.confirm')}
          </Button>
        </Row>
      </div>
    </LayoutThird>
  );
}
