import { Loading, Button } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import { toast } from 'react-hot-toast';

const keys = ['Enter'];
interface Props {
  onSend: (text: string) => void;
}
export const ChatInput = ({ onSend }: Props) => {
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
      toast.error('发送失败');
    }
    setLoading(false);
  };
  return (
    <div className='flex'>
      <div className='flex-1'>
        <Input value={text} onChange={textChange} />
      </div>
      <Button auto className='ml-4' onPress={pressHandler}>
        {loading ? (
          <Loading type='spinner' size='sm' color='currentColor' />
        ) : (
          '发送'
        )}
      </Button>
    </div>
  );
};
