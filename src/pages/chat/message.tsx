import { useRequest } from '@/api';
import { MessageBox } from '@/components/MessageBox';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore, useMtvdbStore, useNostrStore } from '@/store';
import { NostrProvider } from 'nostr-react';
import { getPublicKey } from 'nostr-tools';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NOSTR_KEY = 'nostr_sk';
export default function ChatMessage() {
  const nav = useNavigate();
  const relayUrls = useNostrStore((state) => state.relayList);
  const recipient = useNostrStore((state) => state.recipient);
  const initRelayList = useNostrStore((state) => state.initRelayList);
  const setNostr = useGlobalStore((state) => state.setNostr);
  const mtvDb = useMtvdbStore((state) => state.mtvDb);
  const mtvLoaded = useMtvdbStore((state) => state.loaded);
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
    // console.log('本地获取nostr');
    // console.log(mtvDb?.kvdb);
    if (mtvDb?.kvdb) {
      const localSk = await mtvDb.get(NOSTR_KEY);
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
    console.log('mtvLoaded ' + mtvLoaded);
    if (mtvLoaded) {
      getLocalNostr();
    }
  }, [mtvDb, mtvLoaded]);
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
