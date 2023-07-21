// import { useParams } from 'react-router-dom';
import { useRequest } from '@/api';
import { ROUTE_PATH } from '@/router/index';
import { useGlobalStore, useChatStore } from '@/store';
import { useEffect } from 'react';
import { getPublicKey } from 'nostr-tools';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
const NOSTR_KEY = 'nostr_sk';

export default function ChatImChare() {
  const {  nostr } = useGlobalStore((state) => state);
  const [params] = useSearchParams(); // const { pk } = useParams();
  const nav = useNavigate();
  const toSharePk = params?.get('pk');
  const { mutate: searchuser } = useRequest<any[]>(
    {
      url: '/im/searchuser',
      arg: {
        method: 'get',
        auth: true,
        query: {
          param: toSharePk,
        },
      },
    },
    {
      onSuccess(res) {
        console.log('searchuser');
        console.log(res);
        if (res.code === '000000') {
          const { nostrPublicKey, Id, name, imgCid } = res.data;
          if (nostrPublicKey) {
            // setRecipient({ publicKey: nostrPublicKey, Id, name, avatar: imgCid });
            addFriend();
          } else {
            toast.error('对方无法聊天');
          }
        } else {
          toast.error(res.msg);
        }
      },
    },
  );
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
        console.log(res);
        if (res.code === '000000') {
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

  const defaultHandle = async () => {
    if (nostr?.sk && toSharePk) {
      searchuser();
      // await exchangeImPk();
    }
  };

  useEffect(() => {
    defaultHandle();
  }, [nostr]);

  return <div></div>;
}
