// import { useParams } from 'react-router-dom';
import { useRequest } from '@/api';
import { ROUTE_PATH } from '@/router/index';
import { useGlobalStore, useNostrStore } from '@/store';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ChatImChare() {
  
  const nostr = useGlobalStore((state) => state.nostr);
  const createNostr = useGlobalStore((state) => state.createNostr);
  const [ params ] = useSearchParams(); // const { pk } = useParams();
  const setRecipient = useNostrStore((state) => state.setRecipient);
  const nav = useNavigate();
  const toSharePk = params?.get("pk");
  const toDetail = async (cur: any) => {
    await setRecipient({ pk: cur.nostrPublicKey, email: cur.email });
    nav(ROUTE_PATH.CHAT_MESSAGE);
  };

  const { mutate: exchangeImPk } = useRequest({
      url: '/im/exchangeimpkey',
      arg: {
        method: 'post',
        auth: true,
        query: {
          fromPublicKey: toSharePk,
          toPublicKey: nostr?.pk
        },
      }
    },
    {
      onSuccess(res) {
        if (res.code === "000000" && toSharePk) {
          setRecipient({ pk: toSharePk  , email: toSharePk });
          nav(ROUTE_PATH.CHAT_MESSAGE); // location.replace(ROUTE_PATH.CHAT_MESSAGE);
        } else {
          console.error("res:%v, toSharePk:%v",res, toSharePk);
          nav(ROUTE_PATH.HOME);
        }
      },
    },
  );

  const defaultHandle = async () => {
    if (!nostr) {
      await createNostr();
    } else {
      await exchangeImPk();
    }
  }

  useEffect(() => {
      defaultHandle();
  },[nostr]);
  
  return (
    <div >
    </div>
  )
}
