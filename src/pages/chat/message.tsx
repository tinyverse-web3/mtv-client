import { useEffect } from 'react';
import { NostrProvider } from 'nostr-react';
import { useNostrStore } from '@/store';
import { relayInit } from 'nostr-tools';
import { MessageBox } from '@/components/MessageBox';
import Page from '@/layout/page';

export default function ChatMessage() {
  const relayUrls = useNostrStore((state) => state.relayList);
  const recipient = useNostrStore((state) => state.recipient);
  useEffect(() => {
    async function getRelayList() {
      relayUrls.forEach(async (relayUrl) => {
        const relay = relayInit(relayUrl.wss);
        await relay.connect();
        relay.on('connect', (e: any) => {
          // console.log(e);
        });
        // relay.on('connect', () => {
        //   const sub = relay.sub([
        //     {
        //       authors: [recipientPk],
        //       kinds: [3],
        //     },
        //   ]);
        //   sub.on('event', (event) => {
        //     if (event.created_at > mostRecentKind3) {
        //       setMostRecentKind3(event.created_at);

        //       const relayList = JSON.parse(event.content);
        //       const relayUrls = Object.keys(relayList);

        //       if (relayUrls.length > 0) {
        //         const merged = new Set([...relayUrls, ...defaultRelayUrls]);
        //         setRelayUrls([...merged]);
        //       }
        //     }
        //   });
        //   sub.on('eose', () => {
        //     sub.unsub();
        //   });
        // });
      });
    }

    if (recipient) {
      // getRelayList();
    }
  }, [recipient]);
  return (
    <Page className="h-full" title="聊天">
      <NostrProvider relayUrls={relayUrls.map((val) => val.wss)}>
        <MessageBox recipient={recipient}/>
      </NostrProvider>
    </Page>
  );
}
