import { useRequest } from '@/api';
import { MessageBox } from '@/pages/chat/components/MessageBox';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useChatStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function ChatMessage() {
  const nav = useNavigate();
  const { recipient } = useChatStore((state) => state);
  const { t } = useTranslation();
  const fromName = useMemo(() => {
    if (!recipient) {
      return t('pages.chat.recipient.unknow');
    } else if (recipient?.Alias) {
      return recipient.Alias;
    } else if (recipient?.DAuthKey) {
      return `${recipient.DAuthKey?.substring(
        0,
        5,
      )}*****${recipient.DAuthKey?.substring(recipient.DAuthKey?.length - 5)}`;
    } else if (recipient.MessageKey) {
      return `${recipient.MessageKey?.substring(
        0,
        5,
      )}*****${recipient.MessageKey?.substring(
        recipient.MessageKey?.length - 5,
      )}`;
    } else {
      return t('pages.chat.recipient.unknow');
    }
  }, [recipient]);
  const toProfile = () => {
    nav(ROUTE_PATH.CHAT_PROFILE);
  };
  console.log('recipient', recipient);
  return (
    <LayoutThird
      className='h-full'
      title={fromName}
      rightContent={
        <div
          className='i-material-symbols-more-vert h-6 w-6 cursor-pointer'
          onClick={toProfile}></div>
      }>
      {<MessageBox recipient={recipient} />}
    </LayoutThird>
  );
}
