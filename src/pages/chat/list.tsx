import { useRequest } from '@/api';
import { Address } from '@/components/Address';
import { useCheckLogin } from '@/components/BindMail';
import { Button } from '@/components/form/Button';
import LayoutTwo from '@/layout/LayoutTwo';
import { ROUTE_PATH } from '@/router';
import {
  useGlobalStore,
  useMtvStorageStore,
  useNostrStore,
  useWalletStore,
} from '@/store';
import { Card, Text, Input, Image } from '@nextui-org/react';
import { addMinutes, format } from 'date-fns';
import { getPublicKey } from 'nostr-tools';
import { useEffect, useMemo, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from 'react-hot-toast';

function addMinute(minute: number) {
  const currentTime = new Date(); // 获取当前时间
  const newTime = addMinutes(currentTime, 10);
  const formatDate = format(newTime, 'yyyy-MM-dd HH:mm:ss');
  return formatDate;
}
const NOSTR_KEY = 'nostr_sk';
export default function ChatList() {
  const { VITE_WSS_URL } = import.meta.env;
  const [_, copyToClipboard] = useCopyToClipboard();
  const nav = useNavigate();
  const { createNostr, setNostr, bindStatus, nostr } = useGlobalStore(
    (state) => state,
  );
  const { wallet } = useWalletStore((state) => state);
  const mtvStorage = useMtvStorageStore((state) => state.mtvStorage);
  const setRecipient = useNostrStore((state) => state.setRecipient);
  const removeFrient = useNostrStore((state) => state.remove);
  const [showShare, setShowShare] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [friendPk, setFrientPk] = useState('');

  const [messageHistory, setMessageHistory] = useState([]);
  const socketUrl = useMemo(() => {
    return `${VITE_WSS_URL}/socket?publicKey=${wallet?.publicKey}`;
  }, [wallet]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    console.log('readyState', readyState);
  }, [readyState]);
  const { mutate: searchuser } = useRequest<any[]>({
    url: '/im/searchuser',
    arg: {
      method: 'get',
      auth: true,
      query: {
        param: searchText,
      },
    },
  });
  const { mutate: addFriend } = useRequest<any[]>(
    {
      url: '/im/addfriend',
      arg: {
        method: 'post',
        auth: true,
        query: {
          toPublicKey: friendPk,
        },
      },
    },
    {
      onSuccess() {
        getFriends();
        setFrientPk('');
        setSearchText('');
        toast.success('添加成功');
      },
    },
  );
  const { data: friends, mutate: getFriends } = useRequest<any[]>({
    url: '/im/friends',
    arg: {
      method: 'get',
      auth: true,
    },
  });

  const filterFriends = useMemo(() => {
    return friends?.filter((item) => item.nostrPublicKey);
  }, [friends]);
  const { mutate: sendPk } = useRequest({
    url: '/user/updateimpkey',
    arg: {
      method: 'post',
      auth: true,
      query: {
        nostrPublicKey: nostr?.pk,
      },
    },
  });

  const { mutate: requestImNotify } = useRequest<any[]>({
    url: '/im/notify',
    arg: {
      method: 'get',
      auth: true,
    },
  });

  const getLocalNostr = async () => {
    if (mtvStorage) {
      const localSk = await mtvStorage.get(NOSTR_KEY);
      if (localSk) {
        const pk = getPublicKey(localSk);
        await setNostr({ pk, sk: localSk });
      } else {
        const { sk, pk } = await createNostr();
        await mtvStorage.put(NOSTR_KEY, sk);
        await setNostr({ pk, sk });
      }
      if (bindStatus) {
        await sendPk();
      }
    }
  };

  const toDetail = async ({ nostrPublicKey, Id, name, imgCid }: any) => {
    if (nostr?.sk) {
      console.log(nostrPublicKey, Id, name, imgCid);
      await setRecipient({ pk: nostrPublicKey, Id, name, avatar: imgCid });
      nav(ROUTE_PATH.CHAT_MESSAGE);
    }
  };

  const checkImNotifyTick = async () => {
    const res = await requestImNotify();
    const _list = res.data || [];
    for (let i = 0; i < _list.length; i++) {
      const { toPublicKey } = _list[i];
      addFriend({ pk: toPublicKey });
    }
    setTimeout(checkImNotifyTick, 2000);
  };

  const refreshShareIm = async () => {
    const data = await createShareIm();
  };

  const copyShareImLink = async () => {
    let link = window.location.origin + '/chat/imShare?pk=' + nostr?.pk;
    copyToClipboard(link);
  };

  const { mutate: createShareIm, loading: refreshImConnecting } = useRequest({
    url: '/im/createshareim',
    arg: {
      method: 'post',
      auth: true,
      query: {
        fromPublicKey: nostr?.pk,
      },
    },
  });
  const removeItem = async (e: any, pk: string) => {
    e.stopPropagation();
    await removeFrient(pk);
  };

  const searchHandler = async (e: any) => {
    if (e.key === 'Enter') {
      const data = await searchuser();
      if (data.code === '000000') {
        await setFrientPk(data.data.PublicKey);
      } else {
        toast.error(data.msg);
      }
    }
  };
  useEffect(() => {
    if (bindStatus) {
      sendPk();
    }
  }, [bindStatus]);
  useEffect(() => {
    getFriends();
  }, []);
  useEffect(() => {
    console.log('lastMessage', lastMessage);
    getFriends();
  }, [lastMessage]);
  useEffect(() => {
    if (friendPk) {
      addFriend();
    }
  }, [friendPk]);
  useEffect(() => {
    if (mtvStorage) {
      getLocalNostr();
    }
  }, [mtvStorage]);
  return (
    <LayoutTwo title='私密聊天' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-6'>
        <div className='flex'>
          <div className='flex-1 mb-2'>
            <Input
              value={searchText}
              aria-label='text'
              bordered
              onChange={(e) => setSearchText(e.target.value)}
              fullWidth
              clearable
              onKeyUp={searchHandler}
              placeholder='搜索'
            />
          </div>
        </div>
        <div>
          {filterFriends?.map((item: any) => (
            <div
              className='flex h-22 items-center px-4 border-b border-b-solid border-b-gray-200 cursor-pointer'
              key={item.name}
              onClick={() => toDetail(item)}>
              <Image
                src={item.imgCid || '/logo.png'}
                className='mr-6 w-14 h-14'
              />
              <div className='flex-1'>
                <div className='flex justify-between items-center mb-2'>
                  <span>{item.name}</span>
                  {/* <span className='text-12px'>14:00</span> */}
                </div>
                {/* <div className='text-12px'>[3条]今天天气不错</div> */}
              </div>
            </div>
          ))}
        </div>
        <Button className="mx-auto w-full mt-6" onPress={() => setShowShare(true)}>开启聊天</Button>
        {showShare && (
          <div>
            {nostr?.pk ? (
              <div>
                <Card className='w-60 m-auto'>
                  <Card.Body>
                    <QRCode
                      size={256}
                      style={{
                        height: 'auto',
                        maxWidth: '100%',
                        width: '100%',
                      }}
                      value={
                        window.location.origin + '/chat/imShare?pk=' + nostr?.pk
                      }
                      viewBox={`0 0 256 256`}
                    />
                  </Card.Body>
                </Card>
                <div className='text-center text-5 mb-4'>
                  <Text>有效期：{addMinute(10)}</Text>
                </div>
                <div className='flex justify-center items-center'>
                  <Button
                    auto
                    className='ml-4 min-w-20'
                    color='secondary'
                    loading={refreshImConnecting}
                    onPress={refreshShareIm}>
                    刷新分享链接
                  </Button>
                  <Button
                    auto
                    className='ml-4 min-w-20'
                    color='secondary'
                    onPress={copyShareImLink}>
                    复制分享链接
                  </Button>
                </div>
              </div>
            ) : (
              <div className='mb-2 flex justify-center'>
                <Text>私聊共享缺少nostr公钥</Text>
              </div>
            )}
          </div>
        )}
      </div>
    </LayoutTwo>
  );
}
