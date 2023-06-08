import { useEffect, useMemo } from 'react';
import { useList } from 'react-use';
import { useAccountStore } from '@/store';
import { ChatList } from '@/components/ChatList';
import { ChatInput } from '@/components/ChatInput';
import { useInterval } from 'react-use';

export const MessageBox = ({ recipient }: any) => {
  const [allList, { set: setAllList }] = useList<any[]>([]);
  const [lastList, { set: setLastList }] = useList<any[]>([]);
  const { account } = useAccountStore((state) => state);

  const sendHandler = async (msg: string) => {
    await account.sendMsg(recipient.publicKey, msg);
  };
  const getAllMsgs = async () => {
    const list = await account.getAllMsgs(recipient.publicKey);
    setAllList(list);
  };
  const getMsgs = async () => {
    const list = await account.getMsgs(recipient.publicKey);
    setLastList(list);
  };
  const list = useMemo(() => {
    return [...allList, ...lastList];
  }, [allList, lastList]);
  useInterval(
    () => {
      getMsgs();
    },
    recipient ? 1000 : null,
  );
  useEffect(() => {
    if (recipient) {
      getAllMsgs();
    }
  }, [recipient]);
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
