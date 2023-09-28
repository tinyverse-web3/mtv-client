// import { Loading } from '@nextui-org/react';
import { Button as NextButton, Spinner } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
const keys = ['Enter'];
interface Props {
  onSend: (text: string) => void;
  onFocus: () => void;
}
export const ChatInput = ({ onSend, onFocus }: Props) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  useKeyPressEvent('Enter', () => {
    if (text) {
      pressHandler();
    }
  });
  const textChange = (e: any) => {
    setText(e);
  };
  const pressHandler = async () => {
    if (!text) return;
    setLoading(true);
    try {
      await onSend(text);
      setText('');
    } catch (error) {
      toast.error(t('pages.chat.message.send_error'));
    }
    setLoading(false);
  };
  const touchStartHandler = (e: any) => {
    e.preventDefault();
  };
  return (
    <div className='flex items-center'>
      <div className='flex-1'>
        <Input value={text} onChange={textChange} onFocus={onFocus} />
      </div>
      <div
        className={`ml-2 w-16 h-9 flex justify-center items-center text-white text-xs rounded-lg ${
          !text ? 'bg-gray-400' : 'bg-blue-600 '
        }`}
        onClick={pressHandler}>
        {loading ? (
          <Spinner size='sm' color='white' />
        ) : (
          t('pages.chat.message.btn_send')
        )}
      </div>
      {/* <Button
        size='xs'
        className='ml-2 '
        loading={loading}
        disabled={!text}
        onClick={pressHandler}>
        {t('pages.chat.message.btn_send')}
      </Button> */}
    </div>
  );
};
