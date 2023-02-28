import { Card, Button, Spacer, Text } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNostrStore, useGlobalStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import { useRequest } from '@/api';
import Page from '@/layout/page';

export default function ChatList() {
  const nav = useNavigate();
  const generateUser = useGlobalStore((state) => state.generateUser);
  const setRecipient = useNostrStore((state) => state.setRecipient);
  const user = useGlobalStore((state) => state.userInfo);
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
        nostrPublicKey: user?.nostr?.pk,
      },
    },
  });
  const createUser = async () => {
    if (!user?.nostr?.sk) {
      await generateUser();
      await sendPk();
    }
  };
  const toDetail = async (cur: any) => {
    await setRecipient({ pk: cur.nostrPublicKey, email: cur.email });
    nav(ROUTE_PATH.CHAT_MESSAGE);
  };
  const removeItem = async (e: any, id: string) => {
    e.stopPropagation();
  };
  useEffect(() => {
    createUser();
    mutate();
  }, []);
  return (
    <Page title='记事本'>
      <div className='py-6'>
        {data?.map((item) => (
          <div key={item.nostrPublicKey}>
            <Card onClick={() => toDetail(item)} isPressable variant='bordered'>
              <Card.Body>
                <Text>{item.email}</Text>
              </Card.Body>
              <div
                className='i-mdi-close absolute right-2 top-1/2 -translate-1/2 w-6 h-6'
                onClick={(e) => removeItem(e, item.pk)}></div>
            </Card>
            <Spacer y={1} />
          </div>
        ))}
        {!user && (
          <Button
            color='secondary'
            className='m-auto mb-6'
            onPress={createUser}
            size='md'>
            创建用户
          </Button>
        )}
      </div>
    </Page>
  );
}
