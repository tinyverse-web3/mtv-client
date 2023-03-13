import { useEffect, useRef } from 'react';
// import Chat, { Bubble, useMessages } from '@chatui/core';
import { useNostrEvents, dateToUnix, useNostr } from 'nostr-react';
import { useGlobalStore } from '@/store';
import { signEvent, getEventHash, nip04 } from 'nostr-tools';

export const Message = ({ recipient }: any) => {
  const { publish } = useNostr();
  const preMssages = useRef<any[]>([]);
  const user = useGlobalStore((state) => state.userInfo);
  const nostr = useGlobalStore((state) => state.nostr);
  // const { messages, appendMsg, prependMsgs, resetList } = useMessages(
  //   preMssages.current,
  // );
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
    // const list = preMssages.current;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      // console.log(event);
      const text = await nip04.decrypt(
        nostr?.sk as string,
        recipient.pk,
        event.content,
      );
      if (preMssages.current.find((v: any) => v?.id === event.id)) continue;
      preMssages.current.push({
        ...event,
        text,
      });
      // appendMsg({
      //   type: 'text',
      //   content: { text },
      //   user: {
      //     name: event.pubkey,
      //   },
      // });
      // list.push({
      //   _id: event.id,
      //   type: 'text',
      //   content: { text },
      //   user: {
      //     name: event.pubkey,
      //   },
      // });
    }
    // preMssages.current = list;
    // // resetList(preMssages.current);
    // // prependMsgs(list);
    // console.log(preMssages.current);
  };
  useEffect(() => {
    const messages = [...sentByMe, ...sentToMe].sort(
      (a, b) => a.created_at - b.created_at,
    );
    decryptMessmage(messages);
  }, [sentByMe, sentToMe]);
  // 发送回调
  async function handleSend(type: string, val: string) {
    if (type === 'text' && val.trim()) {
      let ciphertext = await nip04.encrypt(
        nostr?.sk as string,
        recipient.pk,
        val,
      );

      let event: any = {
        kind: 4,
        pubkey: nostr?.pk as string,
        created_at: dateToUnix(),
        tags: [['p', recipient.pk]],
        content: ciphertext,
      };
      event.id = getEventHash(event);
      event.sig = signEvent(event, nostr?.sk as string);
      publish(event);
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item: any) {
    handleSend('text', item.name);
  }

  function renderMessageContent(msg: any) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    // switch (type) {
    //   case 'text':
    //     return <Bubble content={content.text} />;
    //   case 'image':
    //     return (
    //       <Bubble type='image'>
    //         <img src={content.picUrl} alt='' />
    //       </Bubble>
    //     );
    //   default:
    //     return null;
    // }
  }

  return (
    <div className='h-full'>
      {/* <Chat
        navbar={{ title: 'MTV_IM' }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        // onQuickReplyClick={handleQuickReplyClick}
        onSend={handleSend}
      /> */}
    </div>
  );
};
