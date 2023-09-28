import LayoutThird from '@/layout/LayoutThird';
import { Input } from '@/components/form/Input';

import { ContactList } from './components/ContactList';
import { useAssetsStore } from '@/store';
import { ButtonTabs } from '@/components/ButtonTabs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import account from '@/lib/account/account';
import { useChatStore } from '@/store';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'react-use';


export default function contact() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [address, setAddress] = useState('');
  const [searchText, setSearchText] = useState('');

  const { setToAddress } = useAssetsStore((state) => state);
  const { getContacts } = useChatStore((state) => state);
  
  const searchHandler = async (e: any) => {
    if (e.key === 'Enter') {
      toSender();
    }
  };
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
  const selectHandler = () => {
    if (address) {
      setToAddress(address);
      nav(-1);
    }
  };
  const tabList = [
    {
      label: t('pages.assets.contact.address_book'),
      value: 0,
    },
    {
      label: t('pages.assets.contact.frient'),
      value: 1,
    },
  ];
  
  const contactChange = (v: string) => {
    setAddress(v);
  };
  useInterval(() => {
    getContacts();
  }, 2000);
  return (
    <LayoutThird
      className='h-full'
      title={t('pages.assets.contact.title')}
      rightContent={
        <Icon
          icon='charm:tick'
          className=' text-xl   text-blue-500'
          onClick={selectHandler}></Icon>
      }>
      <div className='p-4 py-3'>
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
          {/* <div className='mb-4'>
            <ButtonTabs list={tabList} />
          </div> */}
          <div>
            <ContactList onChange={contactChange} />
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}
