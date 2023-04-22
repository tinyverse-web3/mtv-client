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
      console.log(user.nickname)
      console.log(recipient.name)
      push({
        ...event,
        me: meStatus,
        name: meStatus ? user.nickname : recipient.name,
        avatar: meStatus ? user.avatar : recipient.avatar,
        // email: meStatus ? user.email : recipient.email,
        text,
      });
    }
  };
  useEffect(() => {
    const messages = [...sentByMe, ...sentToMe];
    decryptMessmage(messages);
  }, [sentByMe, sentToMe]);
  const sendHandler = async (val: string) => {
    const { sk, pk } = nostr || {};
    if (val.trim()) {
      let ciphertext = await nip04.encrypt(sk as string, recipient.pk, val);

      let event: any = {
        kind: 4,
        pubkey: pk as string,
        created_at: dateToUnix(new Date()),
        tags: [['p', recipient.pk]],
        content: ciphertext,
      };
      event.id = getEventHash(event);
      event.sig = signEvent(event, sk as string);
      publish(event);
    }
  };

  return (
    <div className='h-full relative overflow-hidden p-2'>
      <div className='h-full pb-12'>
        <ChatList messages={list} />
      </div>
      <div className='px-2 h-12 absolute left-0 w-full bottom-0 bg-blur z-10'>
        <ChatInput onSend={sendHandler} />
      </div>
    </div>
  );
};
