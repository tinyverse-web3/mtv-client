// import { Loading } from '@nextui-org/react';
import { Button as NextButton } from '@nextui-org/react';
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
    setText(e);
  };
  const pressHandler = async () => {
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
        <Input value={text} onChange={textChange} />
      </div>
      {/* <NextButton
        size='sm'
        onTouchStart={touchStartHandler}
        className='ml-2'
        isDisabled={!text}
        style={{ touchAction: 'none' }}>
        {t('pages.chat.message.btn_send')}
      </NextButton> */}
      <Button
        size='xs'
        className='ml-2'
        loading={loading}
        disabled={!text}
        onClick={pressHandler}>
        {t('pages.chat.message.btn_send')}
      </Button>
    </div>
  );
};
