import { useRequest } from '@/api';
import { MessageBox } from '@/components/MessageBox';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore, useMtvStorageStore, useNostrStore } from '@/store';
import { NostrProvider } from 'nostr-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NOSTR_KEY = 'nostr_sk';
export default function ChatMessage() {
  const nav = useNavigate();
  const relayUrls = useNostrStore((state) => state.relayList);
  const recipient = useNostrStore((state) => state.recipient);
  const initRelayList = useNostrStore((state) => state.initRelayList);
  const setNostr = useGlobalStore((state) => state.setNostr);
  const mtvStorage = useMtvStorageStore((state) => state.mtvStorage);
  const nostr = useGlobalStore((state) => state.nostr);
  const { data, mutate } = useRequest<any[]>(
    {
      url: '/im/relays',
      arg: {
        method: 'get',
        auth: true,
      },
    },
    {
      onSuccess(res) {
        const list = res.data?.map((val: any) => ({ wss: val.wsServer }));
        console.log(list);
        initRelayList(list);
      },
    },
  );
  const getLocalNostr = async () => {
    if (mtvStorage) {
      const localSk = await mtvStorage.get(NOSTR_KEY);
      console.log('message local nostr sk: ', localSk);
      // if (localSk) {
      //   const pk = getPublicKey(localSk);
      //   await setNostr({ pk, sk: localSk });
      // } else {
      //   nav(ROUTE_PATH.CHAT_LIST);
      // }
    }
  };
  useEffect(() => {
    getLocalNostr();
  }, [mtvStorage]);
  useEffect(() => {
    mutate();
  }, []);
  useEffect(() => {
    if (!nostr?.sk) {
      nav(ROUTE_PATH.CHAT_LIST);
    }
  }, [nostr]);
  return (
    <LayoutThird className='h-full' title='聊天' path={ROUTE_PATH.CHAT_LIST}>
      {!!relayUrls.length && (
        <NostrProvider relayUrls={relayUrls.map((val) => val.wss)}>
          <MessageBox recipient={recipient} />
        </NostrProvider>
      )}
    </LayoutThird>
  );
}
