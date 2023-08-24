import { Popover, Image } from '@nextui-org/react';
import account from '@/lib/account/account';
import { useEffect, useState } from 'react';
import { useChatStore } from '@/store';
import { Address } from '@/components/Address';
import { useTranslation } from 'react-i18next';
import { ProfileAvatar } from './ProfileAvatar';
interface Props {
  onChange?: (item: any) => void;
}
export const ContactPopover = ({ onChange }: Props) => {
  const { t } = useTranslation();
  const [popverOpen, setPopverOpen] = useState(false);
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
  const selectContact = (item: any) => {
    setPopverOpen(false);
    onChange?.(item);
  };
  useEffect(() => {
    getContacts();
  }, []);
  return (
    <Popover isOpen={popverOpen} onClose={() => setPopverOpen(false)}>
      <Popover.Trigger>
        <div
          className='i-mdi-account-box ml-4 w-7 h-7 text-blue-5 mt-2'
          onClick={() => setPopverOpen(true)}></div>
      </Popover.Trigger>
      <Popover.Content>
        <div className='p-4 w-50 pb-2'>
          {contacts.map((item) => (
            <div
              className='flex items-center mb-2'
              key={item.MessageKey}
              onClick={() => selectContact(item)}>
              <ProfileAvatar
                DestPubkey={item.DAuthKey}
                className='w-6 h-6 mr-2'></ProfileAvatar>
              <div className='text-16px truncate flex-1'>
                {renderName(item)}
              </div>
            </div>
          ))}
        </div>
      </Popover.Content>
    </Popover>
  );
};
