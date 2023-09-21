import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useChatStore } from '@/store';
import { Address } from '@/components/Address';
import { useTranslation } from 'react-i18next';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { RadioGroup, Radio } from '@nextui-org/react';
import { Empty } from '@/components/Empty';

interface Props {
  onChange?: (v: string) => void;
}
export const ContactList = ({ onChange }: Props) => {
  const { t } = useTranslation();
  const { getContacts, contacts } = useChatStore((state) => state);
  const renderName = (item: any) => {
    if (item.Alias) {
      return item.Alias;
    } else if (item.DAuthKey) {
      return <Address address={item.DAuthKey}></Address>;
    } else {
      return t('pages.chat.contact.unknow');
    }
  };
  const onValueChange = (v: string) => {
    console.log(v);
    onChange?.(v);
  };
  useEffect(() => {
    getContacts();
  }, []);
  return (
    <div>
      {!contacts.length ? (
        <div className='bg-gray-50 p-2 rounded-lg'>
          <RadioGroup onValueChange={onValueChange}>
            {contacts.map((item) => (
              <Radio
                className='h-16 w-full'
                value={item.MessageKey}
                classNames={{ base: 'h-16 w-full', labelWrapper: 'flex-1' }}
                key={item.MessageKey}>
                <div className='flex items-center flex-1'>
                  <ProfileAvatar
                    DestPubkey={item.DAuthKey}
                    className='w-8 h-8 mr-2 bg-gray-100'></ProfileAvatar>
                  <div className='text-16px truncate flex-1 border-b-1 border-gray-200 h-10 flex items-center'>
                    {renderName(item)}
                  </div>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </div>
      ) : (
        <div className='pt-10'>
          <Empty />
        </div>
      )}
    </div>
  );
};
