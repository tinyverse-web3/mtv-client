import { useState, useMemo } from 'react';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'react-hot-toast';
import { ValidPassword } from '@/components/ValidPassword';
import account from '@/lib/account/account';
import { usePasswordStore } from '@/store';
import { Icon } from '@iconify/react';
import { Button } from '@/components/form/Button';
import { useTranslation } from 'react-i18next';
import { DelConfirmModel } from '@/components/DelConfirmModel';

export default function PasswordItem({ item, toDetail }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const [showDelStatus, setShowDelStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  const { remove } = usePasswordStore((state) => state);
  const hidePassword = useMemo(() => {
    return item.Password.replace(/./g, '*');
  }, [item.Passowrd]);
  const showPasswordModal = () => {
    setShowPassword(!showPassword);
    // if (!showPassword) {
    //   setShowStatus(true);
    // } else {
    //   setShowPassword(false);
    // }
  };
  const [_, copyToClipboard] = useCopyToClipboard();
  const copy = (text: string) => {
    if (!text) return;
    copyToClipboard(text);
    toast.success(t('common.copy_success'));
  };

  const showDelModal = async (e: any, Filename?: string) => {
    e.stopPropagation();
    if (Filename) {
      setDelItem(Filename);
      setShowDelStatus(true);
    }
  };
  const delConfirm = async () => {
    await remove(delItem);
  };
  const onClose = async () => {
    setShowDelStatus(false);
  };
  return (
    <div className='border-b-gray-200 relative border-b-solid border-b py-2'>
      <Icon
        icon='mdi:trash-can-outline '
        className='absolute right-2 top-6 -translate-1/2 w-6 h-6 text-red'
        onClick={(e) => showDelModal(e, item?.Id)}></Icon>
      <div className='text-4 font-600 mb-1'>{item.Title}</div>
      <div className='flex text-3 mb-2'>
        <div className='flex-1'>
          <div className='flex'>
            <span>{t('common.account')}：</span>
            <div>{item.Account}</div>
          </div>
          <div className='flex'>
            <span>{t('common.password.title')}：</span>
            <div className='flex items-center'>
              <span>{showPassword ? item.Password : hidePassword}</span>
              <Icon
                icon={showPassword ? 'mdi:eye-off' : 'mdi:eye-outline'}
                className='
                  text-4 ml-4'
                onClick={() => showPasswordModal()}></Icon>
            </div>
          </div>
          <div className='flex'>
            <span>{t('common.link')}：</span>
            <div>{item.Url}</div>
          </div>
        </div>
        <div
          className='flex items-center pr-6 w-20 h-full'
          onClick={() => toDetail(item.Id)}>
          <Icon icon='mdi:chevron-right' className=' w-6 h-6' />
        </div>
      </div>
      <div className='flex justify-around'>
        <Button size='xs' className='' onPress={() => copy(item.Account)}>
          {t('common.copy')}
          {t('common.account')}
        </Button>
        <Button size='xs' onPress={() => copy(item.Password)}>
          {t('common.copy')}
          {t('common.password.title')}
        </Button>
        <Button size='xs' onPress={() => copy(item.Url)}>
          {t('common.copy')}
          {t('common.link')}
        </Button>
      </div>

      <DelConfirmModel
        text={t('pages.space.password.title')}
        show={showDelStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </div>
  );
}
