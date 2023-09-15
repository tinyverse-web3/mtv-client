import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, Image } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { useChatStore, useAccountStore } from '@/store';
import { CopyIcon } from '@/components/CopyIcon';
import { useTranslation } from 'react-i18next';
import { QrType } from '@/type';
import { download } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { DelConfirmModel } from '@/components/DelConfirmModel';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';

const Profile: React.FC = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { recipient, setRecipient } = useChatStore((state) => state);
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
      setRecipient({ ...recipient, Alias: alias });
      nav(-1);
    } else {
      toast.error(res.msg);
    }
  };
  const showDelModal = async () => {
    setShowStatus(true);
    console.log(showStatus);
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
  const shortHandler = (str?: string) => {
    if (str) {
      return `${str?.substring(0, 10)}*****${str?.substring(str?.length - 10)}`;
    }
    return '';
  };
  const shortKey = useMemo(() => {
    return shortHandler(recipient?.DAuthKey);
  }, [recipient?.DAuthKey]);
  const shortMessage = useMemo(() => {
    return shortHandler(recipient?.MessageKey);
  }, [recipient?.MessageKey]);
  const shortAddress = useMemo(() => {
    return shortHandler(recipient?.Address);
  }, [recipient?.Address]);
  return (
    <LayoutThird title={t('pages.account.profile.title')}>
      <div className='p-4 h-full overflow-y-auto'>
        <div className='pt-10 mb-4'>
          <Card className='overflow-visible'>
            <CardBody className='overflow-visible'>
              <div className='pt-10 relative px-2'>
                <div className='flex items-center absolute -top-16 left-1/2 transfrom -translate-x-1/2  rounded-full bg-white w-24 h-24 p-2'>
                  <Image src='/logo.png' className='rounded w-20' />
                </div>
                <div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.gun')}</div>
                    <Card>
                      <CardBody className='break-all p-2'>
                        <div>
                          {recipient?.GUNName ||
                            t('pages.account.profile.unset_text')}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.public_key')}</div>
                    <Card>
                      <CardBody className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>{shortKey}</div>
                          {recipient?.DAuthKey && (
                            <CopyIcon
                              text={recipient?.DAuthKey}
                              className='ml-4'
                            />
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.message_key')}</div>
                    <Card>
                      <CardBody className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>{shortMessage}</div>
                          {recipient?.MessageKey && (
                            <CopyIcon
                              text={recipient?.MessageKey}
                              className='ml-4'
                            />
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div className='mb-4'>
                    <div className='mb-2'>{t('pages.account.wallet_key')}</div>
                    <Card>
                      <CardBody className='p-2'>
                        <div className='flex items-center'>
                          <div className='break-all flex-1'>{shortAddress}</div>
                          {recipient?.Address && (
                            <CopyIcon
                              text={recipient?.Address}
                              className='ml-4'
                            />
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
                <div className='mb-4'>
                  <div className='mb-2'>
                    {t('pages.chat.profile.alias.title')}
                  </div>
                  <div className='flex items-center'>
                    <Input
                      value={alias}
                      onChange={(e: string) => setAlias(e)}
                    />
                    <Button
                      size='xs'
                      className='ml-4 h-10'
                      onPress={changeAlias}>
                      {t('pages.chat.profile.btn_change')}
                    </Button>
                  </div>
                </div>
                <div>
                  <Button className='w-full mb-2' onPress={claer}>
                    {t('pages.chat.profile.btn_clear')}
                  </Button>
                  <Button className='w-full mb-2' onClick={showDelModal}>
                    {t('pages.chat.profile.btn_delete')}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <DelConfirmModel
          text={t('pages.chat.contact.title')}
          show={showStatus}
          onConfirm={delConfirm}
          onClose={onClose}
        />
      </div>
    </LayoutThird>
  );
};

export default Profile;
