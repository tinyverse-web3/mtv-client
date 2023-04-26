// import { useParams } from 'react-router-dom';
import { useRequest } from '@/api';
import { ROUTE_PATH } from '@/router/index';
import { useGlobalStore, useNostrStore, useMtvStorageStore } from '@/store';
import { useEffect } from 'react';
import { getPublicKey } from 'nostr-tools';
import { useNavigate, useSearchParams } from 'react-router-dom';
const NOSTR_KEY = 'nostr_sk';

export default function ChatImChare() {
  const nostr = useGlobalStore((state) => state.nostr);
  const createNostr = useGlobalStore((state) => state.createNostr);
  const [params] = useSearchParams(); // const { pk } = useParams();
  const setRecipient = useNostrStore((state) => state.setRecipient);
  const mtvStorage = useMtvStorageStore((state) => state.mtvStorage);
  const setNostr = useGlobalStore((state) => state.setNostr);
  // const addFriend = useNostrStore((state) => state.add);
  const nav = useNavigate();
  const toSharePk = params?.get('pk');
  const toDetail = async (cur: any) => {
    // await setRecipient({ pk: cur.pk });
    nav(ROUTE_PATH.CHAT_MESSAGE);
  };
  const getLocalNostr = async () => {
    // console.log('本地获取nostr');
    // console.log(mtvDb?.kvdb);
    if (mtvStorage) {
      const localSk = await mtvStorage.get(NOSTR_KEY);
      console.log('localSk');
      console.log(localSk);
      if (localSk) {
        const pk = getPublicKey(localSk);
        await setNostr({ pk, sk: localSk });
      } else {
        const { sk, pk } = await createNostr();
        console.log('生成的sk');
        console.log(sk);
        console.log(pk);
        await mtvStorage.put(NOSTR_KEY, sk);
        await setNostr({ pk, sk });
      }
      // await sendPk();
    }
  };
  const { mutate: addFriend } = useRequest<any[]>(
    {
      url: '/im/addfriend',
      arg: {
        method: 'post',
        auth: true,
        query: {
          toPublicKey: toSharePk,
        },
      },
    },
    {
      onSuccess(res) {
        if (res.code === '000000' && toSharePk) {
          // setRecipient({ pk: toSharePk });
          
          nav(ROUTE_PATH.CHAT_MESSAGE, { replace: true }); // location.replace(ROUTE_PATH.CHAT_MESSAGE);
        } else {
          console.error('res:%v, toSharePk:%v', res, toSharePk);
          // nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
        }
      },
    },
  );
  // const { mutate: exchangeImPk } = useRequest(
  //   {
  //     url: '/im/exchangeimpkey',
  //     arg: {
  //       method: 'post',
  //       auth: true,
  //       query: {
  //         fromPublicKey: toSharePk,
  //         toPublicKey: nostr?.pk,
  //       },
  //     },
  //   },
  //   {
  //     onSuccess(res) {
  //       if (res.code === '000000' && toSharePk) {
  //         // setRecipient({ pk: toSharePk });
  //         addFriend({ pk: toSharePk });
  //         nav(ROUTE_PATH.CHAT_MESSAGE, { replace: true }); // location.replace(ROUTE_PATH.CHAT_MESSAGE);
  //       } else {
  //         console.error('res:%v, toSharePk:%v', res, toSharePk);
  //         // nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
  //       }
  //     },
  //   },
  // );
  useEffect(() => {
    console.log('mtvStorage ' + mtvStorage);
    if (mtvStorage) {
      getLocalNostr();
    }
  }, [mtvStorage]);

  const defaultHandle = async () => {
    if (nostr?.sk) {
      // await exchangeImPk();
    }
  };

  useEffect(() => {
    defaultHandle();
  }, [nostr]);

  return <div></div>;
}
