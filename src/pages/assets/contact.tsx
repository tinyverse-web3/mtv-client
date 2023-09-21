import LayoutThird from '@/layout/LayoutThird';
import { Input } from '@/components/form/Input';

import { ContactList } from './components/ContactList';
import { useAssetsStore } from '@/store';
import { ButtonTabs } from '@/components/ButtonTabs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

export default function contact() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [address, setAddress] = useState('');
  const [searchText, setSearchText] = useState('');

  const { setToAddress } = useAssetsStore((state) => state);
  const toSender = async () => {};

  const searchHandler = async (e: any) => {
    if (e.key === 'Enter') {
      toSender();
    }
  };

  const selectHandler = () => {
    if (address) {
      setToAddress(address);
      nav(-1);
    }
  };
  const tabList = [
    {
      label: '地址本',
      value: 0,
    },
    {
      label: '我的好友',
      value: 1,
    },
  ];
  const contactChange = (v: string) => {
    setAddress(v);
  };

  return (
    <LayoutThird
      className='h-full'
      title={t('pages.assets.btn_transfer')}
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
          <div className='mb-4'>
            <ButtonTabs list={tabList} />
          </div>
          <div>
            <ContactList onChange={contactChange} />
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}
