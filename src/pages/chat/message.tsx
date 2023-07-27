import { useRequest } from '@/api';
import { MessageBox } from '@/components/MessageBox';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useChatStore } from '@/store';
import { useNavigate } from 'react-router-dom';

export default function ChatMessage() {
  const { recipient } = useChatStore((state) => state);
  return (
    <LayoutThird className='h-full' title='聊天' path={ROUTE_PATH.CHAT_INDEX}>
      {<MessageBox recipient={recipient} />}
    </LayoutThird>
  );
}
