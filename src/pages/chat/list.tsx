import { Address } from '@/components/Address';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { QRCodeCanvas } from 'qrcode.react';
import account from '@/lib/account/account';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { useChatStore, useAccountStore } from '@/store';
import { Card, CardBody } from '@nextui-org/react';
import { addMinutes, format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard, useInterval } from 'react-use';
import { useNativeScan } from '@/lib/hooks';
import { toast } from 'react-hot-toast';
import { Icon } from '@iconify/react';
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
  const { setRecipient, contacts, getContacts } = useChatStore(
    (state) => state,
  );
  const [showShare, setShowShare] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { result, start } = useNativeScan();
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
    start();
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
        <Icon
          icon='mdi:line-scan'
          className=' text-xl   text-blue-500'
          onClick={toScan}></Icon>
      </div>
      <div className='flex items-center mb-4'>
        <div className='flex-1'>
          <Input
            value={searchText}
            aria-label='text'
            bordered
            fullWidth
            onChange={(e: string) => setSearchText(e)}
            clearable
            onKeyUp={searchHandler}
            placeholder={t('pages.chat.search.placeholder')}
          />
        </div>
        <Icon
          icon='mdi:account-search-outline'
          className=' ml-4 w-7 h-7 text-blue-500'
          onClick={toSender}></Icon>
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
                <div className='text-xs w-40 truncate'>{item.LastMessage}</div>
                <span className='text-xs'>{formatTime(item.LastMsgTime)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
