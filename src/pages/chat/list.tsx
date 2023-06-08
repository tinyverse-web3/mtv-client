import { useRequest } from '@/api';
import { Address } from '@/components/Address';
import { Button } from '@/components/form/Button';
import LayoutTwo from '@/layout/LayoutTwo';
import { ROUTE_PATH } from '@/router';
import { QRCodeCanvas } from 'qrcode.react';
import {
  useChatStore,
  useWalletStore,
  useAccountStore,
} from '@/store';
import { Card, Text, Input, Image } from '@nextui-org/react';
import { addMinutes, format } from 'date-fns';
import { getPublicKey } from 'nostr-tools';
import { useEffect, useMemo, useState } from 'react';
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
  const [_, copyToClipboard] = useCopyToClipboard();
  const nav = useNavigate();
  const [friendList, setFriendList] = useState<any[]>([]);
  const { account } = useAccountStore((state) => state);
  const { wallet } = useWalletStore((state) => state);
  const { setRecipient } = useChatStore((state) => state);
  const [showShare, setShowShare] = useState(false);
  const [searchText, setSearchText] = useState('');
  const getFriends = async () => {
    const list = await account.getFriens();
    setFriendList(list);
  };
  const addFriend = async () => {
    await account.publishMsg(searchText);
    toast.success('添加成功');
    setSearchText('');
    await getFriends();
  };
  const startMsgServer = async () => {
    await account.startMsgService();
  };
  const toDetail = async ({ publicKey, Id, name, imgCid }: any) => {
    console.log(publicKey, Id, name, imgCid);
    await setRecipient({ publicKey, Id, name, avatar: imgCid });
    nav(ROUTE_PATH.CHAT_MESSAGE);
  };

  const checkImNotifyTick = async () => {
    // const res = await requestImNotify();
    // const _list = res.data || [];
    // for (let i = 0; i < _list.length; i++) {
    //   const { toPublicKey } = _list[i];
    //   addFriend({ pk: toPublicKey });
    // }
    // setTimeout(checkImNotifyTick, 2000);
  };

  const refreshShareIm = async () => {
    const data = await createShareIm();
  };

  const copyShareImLink = async () => {
    let link =
      window.location.origin + '/#/chat/imShare?pk=' + wallet?.publicKey;
    copyToClipboard(link);
  };

  const { mutate: createShareIm, loading: refreshImConnecting } = useRequest({
    url: '/im/createshareim',
    arg: {
      method: 'post',
      auth: true,
      query: {
        // fromPublicKey: nostr?.pk,
      },
    },
  });
  const removeItem = async (e: any, pk: string) => {
    e.stopPropagation();
    // await removeFrient(pk);
  };

  const searchHandler = async (e: any) => {
    if (e.key === 'Enter') {
      const data = await addFriend();
    }
  };
  useEffect(() => {
    getFriends();
    startMsgServer();
  }, []);
  // useEffect(() => {
  //   console.log('lastMessage', lastMessage);
  //   getFriends();
  // }, [lastMessage]);
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
          {friendList?.map((item: any) => (
            <div
              className='flex h-22 items-center px-4 border-b border-b-solid border-b-gray-200 cursor-pointer'
              key={item.name}
              onClick={() => toDetail(item)}>
              <Image
                src={item.imgCid || '/logo.png'}
                className='mr-6 w-12 h-12'
              />
              <div className='flex-1'>
                <div className='flex justify-between items-center mb-2'>
                  <span>
                    {item.name || <Address address={item.PublicKey}></Address>}
                  </span>
                  {/* <span className='text-12px'>14:00</span> */}
                </div>
                {/* <div className='text-12px'>[3条]今天天气不错</div> */}
              </div>
            </div>
          ))}
        </div>
        <Button
          className='mx-auto w-full mt-6'
          onPress={() => setShowShare(true)}>
          开启聊天
        </Button>
        {showShare && (
          <div>
            <div>
              <Card className='w-fit m-auto'>
                <Card.Body>
                  <QRCodeCanvas
                    size={200}
                    value={
                      window.location.origin +
                      '/#/chat/imShare?pk=' +
                      wallet?.publicKey
                    }
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
          </div>
        )}
      </div>
    </LayoutTwo>
  );
}
