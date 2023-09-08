import { Address } from '@/components/Address';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { QRCodeCanvas } from 'qrcode.react';
import account from '@/lib/account/account';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { useChatStore, useAccountStore } from '@/store';
import {
  Card,
  CardBody,
} from '@nextui-org/react';
import { addMinutes, format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard, useInterval } from 'react-use';
import { toast } from 'react-hot-toast';
import { Icon } from '@iconify/react'
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
  const { setRecipient,contacts, getContacts } = useChatStore((state) => state);
  const [showShare, setShowShare] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  // const getContacts = async () => {
  //   const list = await account.getContacts();
  //   if (list.length !== friendList.length) {
  //     setFriendList(list);
  //   }
  // };

  const toSender = async () => {
    if (!searchText) {
      toast(t('pages.chat.search.empty'));
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
    let link = '';
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
        <div className='flex items-center   '>
          <span className='text-blue-500'>{t('pages.chat.title')}</span>
        </div>
        <div
          className='mdi:line-scan text-6   text-blue-500'
          onClick={toScan}></div>
      </div>
      <div className='flex items-center mb-4'>
        <div className='flex-1'>
          <Input
            value={searchText}
            aria-label='text'
            bordered
            onChange={(e: string) => setSearchText(e)}
            fullWidth
            clearable
            onKeyUp={searchHandler}
            placeholder={t('pages.chat.search.placeholder')}
          />
        </div>
        <div
          className='mdi:account-search-outline ml-4 w-7 h-7 text-blue-500'
          onClick={toSender}></div>
      </div>
      <div>
        {contacts?.map((item: any) => (
          <div
            className='flex h-16 items-center px-6  rounded-full bg-gray-100 mb-2'
            key={item.MessageKey}
            onClick={() => toDetail(item)}>
            <ProfileAvatar
              DestPubkey={item.DAuthKey}
              className='w-10 h-10 mr-4'
            />
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
              className='mdi:trash-can-outline ml-4 w-6 h-6 text-red'
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
            <Card className='w-fit m-auto'>
              <CardBody>
                <QRCodeCanvas
                  size={200}
                  value={
                    window.location.origin +
                    '/#/chat/imShare?pk='
                  }
                />
              </CardBody>
            </Card>
            <div className='text-center text-5 mb-4'>
              <div>有效期：{addMinute(10)}</div>
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
