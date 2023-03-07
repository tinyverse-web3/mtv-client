import { useEffect, useRef, useState } from 'react';
import { useList } from 'react-use';
import { useNostrEvents, dateToUnix, useNostr } from 'nostr-react';
import { useGlobalStore } from '@/store';
import { signEvent, getEventHash, nip04 } from 'nostr-tools';
import { ChatList } from '@/components/ChatList';
import { ChatInput } from '@/components/ChatInput';
export const MessageBox = ({ recipient }: any) => {
  const { publish } = useNostr();
  const [list, { push }] = useList<any[]>([]);
  const user = useGlobalStore((state) => state.userInfo);
  const nostr = useGlobalStore((state) => state.nostr);
  const { events: sentByMe } = useNostrEvents({
    filter: {
      kinds: [4],
      authors: [nostr?.pk as string],
      '#p': [recipient?.pk as string],
    },
  });
  const { events: sentToMe } = useNostrEvents({
    filter: {
      kinds: [4],
      authors: [recipient?.pk as string],
      '#p': [nostr?.pk as string],
    },
  });
  const decryptMessmage = async (events: any[]) => {
    if (!events.length) return;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const text = await nip04.decrypt(
        nostr?.sk as string,
        recipient.pk,
        event.content,
      );
      if (list.find((v: any) => v?.id === event.id)) {
        continue;
      }
      const meStatus = event.pubkey === nostr?.pk;
      push({
        ...event,
        me: meStatus,
        email: meStatus ? user.email : recipient.email,
        text,
      });
    }
  };
  useEffect(() => {
    const messages = [...sentByMe, ...sentToMe].sort(
      (a, b) => a.created_at - b.created_at,
    );
    decryptMessmage(messages);
  }, [sentByMe, sentToMe]);
  const sendHandler = async (val: string) => {
    const { sk, pk } = nostr || {};
    if (val.trim()) {
      let ciphertext = await nip04.encrypt(sk as string, recipient.pk, val);

      let event: any = {
        kind: 4,
        pubkey: pk as string,
        created_at: dateToUnix(),
        tags: [['p', recipient.pk]],
        content: ciphertext,
      };
      event.id = getEventHash(event);
      event.sig = signEvent(event, sk as string);
      publish(event);
    }
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-1 overflow-hidden'>
        <ChatList messages={list} />
      </div>
      <div className='h-12'>
        <ChatInput onSend={sendHandler} />
      </div>
    </div>
  );
};
