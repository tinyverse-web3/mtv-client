import { Loading } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
const keys = ['Enter'];
interface Props {
  onSend: (text: string) => void;
}
export const ChatInput = ({ onSend }: Props) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  useKeyPressEvent('Enter', () => {
    if (text) {
      pressHandler();
    }
  });
  const textChange = (e: any) => {
    setText(e?.trim());
  };
  const pressHandler = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onSend(text);
      setText('');
    } catch (error) {
      toast.error(t('pages.chat.message.send_error'));
    }
    setLoading(false);
  };
  return (
    <div className='flex '>
      <div className='flex-1'>
        <Input value={text} onChange={textChange} />
      </div>
      <div
        className='cursor-pointer w-16 flex justify-center items-center px-2 rounded-3 bg-blue-5 text-white ml-2'
        onClick={pressHandler}>
        {loading ? (
          <Loading type='spinner' size='sm' color='currentColor' />
        ) : (
          t('pages.chat.message.btn_send')
        )}
      </div>
    </div>
  );
};
