import React, { useEffect, useState, useMemo } from 'react';
import { Image, Button as NextButton } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { useChatStore, useAccountStore } from '@/store';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DelConfirmModel } from '@/components/DelConfirmModel';

const Profile: React.FC = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { recipient } = useChatStore((state) => state);
  const [alias, setAlias] = React.useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  const changeAlias = async () => {
    const res = await account.setContactAlias({
      destPubkey: recipient?.DAuthKey,
      alias,
    });
    if (res.code === '000000') {
      toast.success(t('pages.chat.profile.alias.change_success'));
      nav(-1);
    } else {
      toast.error(res.msg);
    }
  };
  const showDelModal = async () => {
    setShowStatus(true);
  };
  const claer = async () => {
    if (recipient?.MessageKey) {
      const { code, msg } = await account.clearContactMessage(
        recipient?.MessageKey,
      );
      if (code === '000000') {
        toast.success(t('pages.chat.profile.clear_success'));
      } else {
        toast.error(msg || t('pages.chat.profile.clear_error'));
      }
    }
  };
  const removeItem = async () => {
    if (recipient?.MessageKey) {
      const { code, msg } = await account.delContact(recipient.MessageKey);
      if (code === '000000') {
        toast.success(t('pages.chat.contact.delete_success'));
        nav(-2);
      } else {
        toast.error(msg || t('pages.chat.contact.delete_error'));
      }
    }
  };
  const delConfirm = async () => {
    await removeItem();
  };
  const onClose = async () => {
    setShowStatus(false);
  };
  const fromName = useMemo(() => {
    if (!recipient) {
      return t('pages.chat.profile.recipient.unknow');
    } else if (recipient?.Alias) {
      return recipient.Alias;
    } else if (recipient?.DAuthKey) {
      return `${recipient.DAuthKey?.substring(
        0,
        5,
      )}*****${recipient.DAuthKey?.substring(recipient.DAuthKey?.length - 5)}`;
    } else if (recipient.MessageKey) {
      return `${recipient.MessageKey?.substring(
        0,
        5,
      )}*****${recipient.MessageKey?.substring(
        recipient.MessageKey?.length - 5,
      )}`;
    } else {
      return t('pages.chat.profile.recipient.unknow');
    }
  }, [recipient]);
  useEffect(() => {
    if (recipient) {
      setAlias(recipient?.Alias || '');
    }
  }, [recipient]);
  return (
    <LayoutThird title={fromName} className='h-full'>
      <div className='p-4'>
        <div className='flex items-center mb-4'>
          <Image src='/logo.png' className='rounded w-20' />
        </div>
        <div>
          <div className='flex mb-2'>
            <span className='w-14 min-w-20'>
              {t('pages.account.public_key')}：
            </span>
            <span className='break-all'>{recipient?.DAuthKey}</span>
          </div>
          <div className='flex mb-2'>
            <span className='w-14 min-w-20'>
              {t('pages.account.message_key')}：
            </span>
            <span className='break-all'>{recipient?.MessageKey}</span>
          </div>
          <div className='flex mb-2'>
            <span className='w-14 min-w-20'>
              {t('pages.account.gun')}：
            </span>
            <span className='break-all'>{recipient?.GUNName}</span>
          </div>
          <div className='flex mb-4'>
            <span className='w-14 min-w-20'>
              {t('pages.chat.profile.alias.title')}：
            </span>
            <Input value={alias} onChange={(e: string) => setAlias(e)} />
            <NextButton
              auto
              flat
              size='xs'
              className='ml-4 h-10'
              onPress={changeAlias}>
              {t('pages.chat.profile.btn_change')}
            </NextButton>
          </div>
          <div>
            <Button className='w-full mb-2' onPress={claer}>
              {t('pages.chat.profile.btn_clear')}
            </Button>
            <Button className='w-full mb-2' onPress={showDelModal}>
              {t('pages.chat.profile.btn_delete')}
            </Button>
          </div>
        </div>
      </div>
      <DelConfirmModel
        text={t('pages.chat.contact.title')}
        show={showStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </LayoutThird>
  );
};

export default Profile;
