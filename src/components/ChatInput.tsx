import { Text, Button } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';

const keys = ['Enter'];
interface Props {
  onSend: (text: string) => void;
}
export const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState('');

  useKeyPressEvent('Enter', () => {
    if (text) {
      pressHandler();
    }
  });
  const textChange = (e: any) => {
    setText(e?.trim());
  };
  const pressHandler = async () => {
    await onSend(text);
    setText('');
  };
  return (
    <div className='flex'>
      <div className='flex-1'>
        <Input value={text} onChange={textChange} />
      </div>
      <Button auto className='ml-4' onPress={pressHandler}>
        发送
      </Button>
    </div>
  );
};
