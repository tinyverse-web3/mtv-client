import { useEffect, useMemo, useCallback, useRef } from 'react';
import { useList } from 'react-use';
import { useAccountStore } from '@/store';
import { ChatList } from '@/pages/chat/components/ChatList';
import { ChatInput } from '@/pages/chat/components/ChatInput';
import { useInterval } from 'react-use';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export const MessageBox = ({ recipient }: any) => {
  const { t } = useTranslation();
  const [allList, { set: setAllList, push }] = useList<any>([]);
  // const [lastList, { set: setLastList, push }] = useList<any>([]);
  const listRef = useRef<any>(null);
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
  const onFocus = () => {
    console.log('onFocus');
    listRef.current?.handleScrollToBottom();
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
    // const meName =
    //   accountInfo.name ||
    //   accountInfo.publicKey.substring(accountInfo.publicKey.length - 4);
    const meName = t('pages.chat.message.me_name');
    const fromName =
      recipient.Alias ||
      recipient.DAuthKey?.substring(recipient.DAuthKey.length - 4) ||
      recipient.MessageKey?.substring(recipient.MessageKey.length - 4);
    return [...allList].map((v) => {
      const isMe = v.Direction === 'to';

      const name = isMe ? meName : fromName;
      return {
        ...v,
        publicKey:
          v.Direction === 'to'
            ? accountInfo.publicKey
            : recipient.DAuthKey || recipient.MessageKey,
        name: name,
        isMe: v.Direction === 'to',
      };
    });
  }, [allList, accountInfo.publicKey]);
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
  return (
    <div className='h-full relative overflow-hidden p-2'>
      <div className='h-full pb-12'>
        <ChatList messages={list} ref={listRef} />
      </div>
      <div className='px-2 h-12 absolute left-0 w-full bottom-0 bg-blur z-10'>
        <ChatInput onSend={sendHandler} onFocus={onFocus} />
      </div>
    </div>
  );
};
