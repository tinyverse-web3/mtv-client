import { Text, Input, Button } from '@nextui-org/react';
import { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
}
export const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState('');
  const textChange = (e: any) => {
    setText(e.target.value);
  };
  const pressHandler = async (e: any) => {
    await onSend(text);
    setText('');
  };
  return (
    <div className='flex'>
      <div className='flex-1'>
        <Input
          aria-label='text'
          fullWidth
          clearable
          value={text}
          onChange={textChange}
        />
      </div>
      <Button auto className='ml-4' onPress={pressHandler}>
        发送
      </Button>
    </div>
  );
};
