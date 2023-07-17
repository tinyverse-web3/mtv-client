import { useRequest } from '@/api';
import { Address } from '@/components/Address';
import LayoutTwo from '@/layout/LayoutTwo';
import { Button } from '@/components/form/Button';
import { ROUTE_PATH } from '@/router';
import { QRCodeCanvas } from 'qrcode.react';
import account from '@/lib/account/account';
import { useChatStore, useWalletStore, useAccountStore } from '@/store';
import {
  Card,
  Text,
  Input,
  Image,
  Button as NextButton,
} from '@nextui-org/react';
import { addMinutes, format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard, useInterval } from 'react-use';
import { toast } from 'react-hot-toast';

function addMinute(minute: number) {
  const currentTime = new Date(); // 获取当前时间
  const newTime = addMinutes(currentTime, 10);
  const formatDate = format(newTime, 'yyyy-MM-dd HH:mm:ss');
  return formatDate;
}

const renderName = (item: any) => {
  if (item.Alias) {
    return item.Alias;
  } else if (item.DAuthKey) {
    return <Address address={item.DAuthKey}></Address>;
  } else {
    return '匿名';
  }
};
export default function ChatList() {
  const [_, copyToClipboard] = useCopyToClipboard();
  const nav = useNavigate();
  const [friendList, setFriendList] = useState<any[]>([]);
  const { wallet } = useWalletStore((state) => state);
  const { setRecipient } = useChatStore((state) => state);
  const [showShare, setShowShare] = useState(false);
  const [searchText, setSearchText] = useState('');
  const getContacts = async () => {
    const list = await account.getContacts();
    if (list.length !== friendList.length) {
      setFriendList(list);
    }
  };

  const toSender = async () => {
    await account.createContact(searchText);
    setSearchText('');
    // await toDetail({ DAuthKey: searchText });
  };
  const toDetail = async (item: any) => {
    await setRecipient(item);
    nav(ROUTE_PATH.CHAT_MESSAGE);
  };
  const toProfile = async (item: any) => {
    await setRecipient(item);
    nav(ROUTE_PATH.CHAT_PROFILE);
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
      toSender();
    }
  };
  const formatTime = (time: number) => {
    if (!time) return;
    if (time.toString().length === 10) {
      time = time * 1000;
    }
    return format(new Date(time), 'HH:mm');
  };
  useEffect(() => {
    getContacts();
  }, []);

  useInterval(() => {
    getContacts();
  }, 2000);
  return (
    <LayoutTwo title='私密聊天' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-6'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <Input
              value={searchText}
              aria-label='text'
              bordered
              onChange={(e) => setSearchText(e.target.value)}
              fullWidth
              clearable
              onKeyUp={searchHandler}
              placeholder='对方公钥'
            />
          </div>
          <NextButton
            auto
            flat
            size='xs'
            className='ml-4 h-10'
            onPress={toSender}>
            添加联系人
          </NextButton>
        </div>
        <div>
          {friendList?.filter(Boolean).map((item: any) => (
            <div
              className='flex h-22 items-center px-4 border-b border-b-solid border-b-gray-200 cursor-pointer'
              key={item.DAuthKey}
              onClick={() => toDetail(item)}>
              <Image
                src={item.imgCid || '/logo.png'}
                className='mr-6 w-12 h-12'
              />
              <div className='flex-1'>
                <div className='flex justify-between items-center mb-2'>
                  <span>{renderName(item)}</span>
                  <span className='text-12px'>
                    {formatTime(item.LastMsgTime)}
                  </span>
                </div>
                <div className='text-12px'>{item.LastMessage}</div>
              </div>
              {item.DAuthKey && (
                <NextButton
                  auto
                  flat
                  size='xs'
                  className='ml-4 h-10'
                  onPress={() => toProfile(item)}>
                  编辑
                </NextButton>
              )}
            </div>
          ))}
        </div>
        {/* <Button
          className='mx-auto w-full mt-6'
          onPress={() => setShowShare(true)}>
          开启聊天
        </Button> */}
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
