import { useEffect, useMemo, useCallback } from 'react';
import { useList } from 'react-use';
import { useAccountStore } from '@/store';
import { ChatList } from '@/pages/chat/components/ChatList';
import { ChatInput } from '@/pages/chat/components/ChatInput';
import { useInterval } from 'react-use';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';

export const MessageBox = ({ recipient }: any) => {
  const [allList, { set: setAllList, push }] = useList<any>([]);
  // const [lastList, { set: setLastList, push }] = useList<any>([]);
  const { accountInfo } = useAccountStore((state) => state);

  const sendHandler = async (msg: string) => {
    if (msg === undefined || msg === '' || msg === null) {
      return;
    }

    const res = await account.sendMsg(
      recipient.DAuthKey || recipient.MessageKey,
      msg,
    );
    if (res.code !== '000000') {
      toast.error(res.msg);
      throw new Error(res.msg);
    }
    await getMsgs();
  };
  const getAllMsgs = async () => {
    const list = await account.getAllMsgs(
      recipient.DAuthKey || recipient.MessageKey,
    );
    if (list?.length) {
      setAllList(list);
    }
  };
  const getMsgs = async () => {
    const list = await account.receiveMsgs(
      recipient.DAuthKey || recipient.MessageKey,
    );
    if (list?.length) {
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        push(e);
      }
    }
  };
  const list = useMemo(() => {
    return [...allList].map((v) => ({
      ...v,
      publicKey:
        v.Direction === 'to'
          ? accountInfo.publicKey
          : recipient.Alias || recipient.DAuthKey || recipient.MessageKey,
      isMe: v.Direction === 'to',
    }));
  }, [allList]);
  useInterval(
    () => {
      getMsgs();
    },
    recipient ? 3000 : null,
  );
  useEffect(() => {
    if (recipient) {
      getAllMsgs();
    }
  }, [recipient]);
  console.log(list);
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