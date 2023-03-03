import { Card, Button, Spacer, Text } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNostrStore, useGlobalStore, useMtvdbStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import { useRequest } from '@/api';
import { getPublicKey } from 'nostr-tools';
import { useLifecycles } from 'react-use';
import Page from '@/layout/page';

const NOSTR_KEY = 'nostr_sk';
export default function ChatList() {
  const nav = useNavigate();
  const createNostr = useGlobalStore((state) => state.createNostr);
  const setNostr = useGlobalStore((state) => state.setNostr);
  const mtvDb = useMtvdbStore((state) => state.mtvDb);
  const mtvLoaded = useMtvdbStore((state) => state.loaded);
  const setRecipient = useNostrStore((state) => state.setRecipient);
  const nostr = useGlobalStore((state) => state.nostr);
  const { data, mutate } = useRequest<any[]>(
    {
      url: '/user/getimpubkeylist',
      arg: {
        method: 'get',
        auth: true,
      },
    },
    { revalidateOnMount: true },
  );
  const { mutate: sendPk } = useRequest({
    url: '/user/modifyuser',
    arg: {
      method: 'post',
      auth: true,
      query: {
        nostrPublicKey: nostr?.pk,
      },
    },
  });
  const getLocalNostr = async () => {
    // console.log('本地获取nostr');
    // console.log(mtvDb?.kvdb);
    if (mtvDb?.kvdb) {
      const localSk = await mtvDb.get(NOSTR_KEY);
      console.log('localSk');
      console.log(localSk);
      if (localSk) {
        const pk = getPublicKey(localSk);
        await setNostr({ pk, sk: localSk });
      } else {
        const { sk, pk } = await createNostr();
        console.log('create new nostr key');
        await mtvDb.put(NOSTR_KEY, sk);
        await setNostr({ pk, sk });
        await sendPk(pk);
      }
    }
  };
  const toDetail = async (cur: any) => {
    await setRecipient({ pk: cur.nostrPublicKey, email: cur.email });
    nav(ROUTE_PATH.CHAT_MESSAGE);
  };
  const removeItem = async (e: any, id: string) => {
    e.stopPropagation();
  };
  useLifecycles(() => {
    mutate();
  });
  useEffect(() => {
    getLocalNostr();
  }, [mtvDb]);
  useEffect(() => {
    console.log(mtvLoaded);
    if (mtvLoaded) {
      getLocalNostr();
    }
  }, [mtvDb, mtvLoaded]);
  return (
    <Page title='私密聊天' path={ROUTE_PATH.HOME}>
      <div className='py-6'>
        {data?.map((item) => (
          <div key={item.nostrPublicKey}>
            <Card onClick={() => toDetail(item)} isPressable variant='bordered'>
              <Card.Body>
                <Text>{item.email}</Text>
              </Card.Body>
              {/* <div
                className='i-mdi-close absolute right-2 top-1/2 -translate-1/2 w-6 h-6'
                onClick={(e) => removeItem(e, item.pk)}></div> */}
            </Card>
            <Spacer y={1} />
          </div>
        ))}
        {/* <Button onPress={getLocalNostr}>创建</Button> */}
      </div>
    </Page>
  );
}
