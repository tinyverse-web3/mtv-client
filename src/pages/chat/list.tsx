import { Address } from '@/components/Address';
import { Button } from '@/components/form/Button';
import { ROUTE_PATH } from '@/router';
import { QRCodeCanvas } from 'qrcode.react';
import account from '@/lib/account/account';
import { ProfileAvatar } from '@/components/ProfileAvatar';
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
import { useTranslation } from 'react-i18next';
function addMinute(minute: number) {
  const currentTime = new Date(); // 获取当前时间
  const newTime = addMinutes(currentTime, 10);
  const formatDate = format(newTime, 'yyyy-MM-dd HH:mm:ss');
  return formatDate;
}

export default function ChatList() {
  const { t } = useTranslation();
  const renderName = (item: any) => {
    if (item.Alias) {
      return item.Alias;
    } else if (item.DAuthKey) {
      return <Address address={item.DAuthKey}></Address>;
    } else {
      return t('pages.chat.contact.unknow');
    }
  };

  const [_, copyToClipboard] = useCopyToClipboard();
  const nav = useNavigate();
  const [friendList, setFriendList] = useState<any[]>([]);
  const { wallet } = useWalletStore((state) => state);
  const { setRecipient } = useChatStore((state) => state);
  const [showShare, setShowShare] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  const getContacts = async () => {
    const list = await account.getContacts();
    if (list.length !== friendList.length) {
      setFriendList(list);
    }
  };

  const toSender = async () => {
    if (!searchText) {
      toast('pages.chat.search.empty');
      return;
    }
    const { code, msg } = await account.createContactByMasterKey(searchText);

    if (code === '000000') {
      toast.success(t('pages.chat.search.success'));
    } else {
      toast.error(msg || t('pages.chat.search.error'));
    }
    setSearchText('');
  };
  const toDetail = async (item: any) => {
    await setRecipient(item);
    nav(ROUTE_PATH.CHAT_MESSAGE);
  };

  const refreshShareIm = async () => {};

  const copyShareImLink = async () => {
    let link =
      window.location.origin + '/#/chat/imShare?pk=' + wallet?.publicKey;
    copyToClipboard(link);
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
  const toScan = () => {
    nav(ROUTE_PATH.ACCOUNT_SCAN);
  };
  useEffect(() => {
    getContacts();
  }, []);

  useInterval(() => {
    getContacts();
  }, 2000);
  return (
    <div className='p-4 py-3'>
      <div className='flex justify-between mb-3'>
        <div className='flex items-center  cursor-pointer '>
          <span className='text-blue-5'>消息</span>
        </div>
        <div
          className='i-mdi-line-scan text-6  cursor-pointer text-blue-5'
          onClick={toScan}></div>
      </div>
      <div className='flex items-center mb-4'>
        <div className='flex-1'>
          <Input
            value={searchText}
            aria-label='text'
            bordered
            onChange={(e) => setSearchText(e.target.value)}
            fullWidth
            clearable
            onKeyUp={searchHandler}
            placeholder={t('pages.chat.search.placeholder')}
          />
        </div>
        <div
          className='i-mdi-account-search-outline ml-4 w-7 h-7 text-blue-5'
          onClick={toSender}></div>
      </div>
      <div>
        {friendList?.filter(Boolean).map((item: any) => (
          <div
            className='flex h-16 items-center px-6 cursor-pointer rounded-full bg-gray-1 mb-2'
            key={item.MessageKey}
            onClick={() => toDetail(item)}>
              <ProfileAvatar DestPubkey={item.DAuthKey} className='w-10 h-10 mr-4'/>
            <div className='flex-1'>
              <div className='flex justify-between items-center mb-2 truncate'>
                <span>{renderName(item)}</span>
              </div>
              <div className='flex justify-between items-center'>
                <div className='text-12px w-40 truncate'>
                  {item.LastMessage}
                </div>
                <span className='text-12px'>
                  {formatTime(item.LastMsgTime)}
                </span>
              </div>
            </div>
            {/* <div
              className='i-mdi-trash-can-outline ml-4 w-6 h-6 text-red'
              onClick={(e) => showDelModal(e, item)}></div> */}
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
            <Card variant="bordered"  className='w-fit m-auto'>
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
  );
}
