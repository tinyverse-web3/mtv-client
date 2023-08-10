import { useRequest } from '@/api';
import { MessageBox } from '@/pages/chat/components/MessageBox';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useChatStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export default function ChatMessage() {
  const { recipient } = useChatStore((state) => state);
  const fromName = useMemo(() => {
    if (!recipient) {
      return '对方';
    } else if (recipient?.Alias) {
      return recipient.Alias
    } else if (recipient?.DAuthKey) {
      return `${recipient.DAuthKey?.substring(
        0,
        5,
      )}*****${recipient.DAuthKey?.substring(
        recipient.DAuthKey?.length - 5,
      )}`
    } else if (recipient.MessageKey) {
      return `${recipient.MessageKey?.substring(
        0,
        5,
      )}*****${recipient.MessageKey?.substring(
        recipient.MessageKey?.length - 5,
      )}`
    } else {
      return '对方'
    }
  }, [recipient]);
  console.log('recipient', recipient)
  return (
    <LayoutThird className='h-full' title={fromName} path={ROUTE_PATH.CHAT_INDEX}>
      {<MessageBox recipient={recipient} />}
    </LayoutThird>
  );
}
