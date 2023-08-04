import { Button as NextButton } from '@nextui-org/react';
import { useState, useMemo } from 'react';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'react-hot-toast';
import { ValidPassword } from '@/components/ValidPassword';
import account from '@/lib/account/account';
import { usePasswordStore } from '@/store';
import { DelConfirmModel } from '@/components/DelConfirmModel';

export default function PasswordItem({ item, toDetail }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showDelStatus, setShowDelStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  const { remove } = usePasswordStore((state) => state);
  const hidePassword = useMemo(() => {
    return item.Password.replace(/./g, '*');
  }, [item.Passowrd]);
  const showPasswordModal = () => {
    if (!showPassword) {
      setShowStatus(true);
    } else {
      setShowPassword(false);
    }
  };
  const [_, copyToClipboard] = useCopyToClipboard();
  const copy = (text: string) => {
    if (!text) return;
    copyToClipboard(text);
    toast.success('复制成功');
  };
  const modalClose = () => {
    setShowStatus(false);
  };
  const passwordConfirm = async () => {
      setShowPassword(true);
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
    setShowStatus(false);
  };
  return (
    <div className='border-b-gray-200 relative border-b-solid border-b py-2'>
      <div
        className='i-mdi-close absolute right-2 top-6 -translate-1/2 w-6 h-6 text-red'
        onClick={(e) => showDelModal(e, item?.Id)}></div>
      <div className='text-4 font-600 mb-1'>{item.Title}</div>
      <div className='flex text-3 mb-2'>
        <div className='flex-1'>
          <div className='flex'>
            <span>账号：</span>
            <div>{item.Account}</div>
          </div>
          <div className='flex'>
            <span>密码：</span>
            <div className='flex items-center'>
              <span>{showPassword ? item.Password : hidePassword}</span>
              <div
                className={`${
                  showPassword ? 'i-mdi-eye-off' : 'i-mdi-eye-outline'
                } text-4 ml-4`}
                onClick={() => showPasswordModal()}></div>
            </div>
          </div>
          <div className='flex'>
            <span>网址：</span>
            <div>{item.Url}</div>
          </div>
        </div>
        <div
          className='flex items-center pr-6 w-20 h-full'
          onClick={() => toDetail(item.Id)}>
          <div className='i-mdi-chevron-right w-6 h-6'></div>
        </div>
      </div>
      <div className='flex justify-around'>
        <NextButton
          auto
          flat
          size='xs'
          className=''
          onPress={() => copy(item.Account)}>
          复制账号
        </NextButton>
        <NextButton auto flat size='xs' onPress={() => copy(item.Password)}>
          复制密码
        </NextButton>
        <NextButton auto flat size='xs' onPress={() => copy(item.Url)}>
          复制网址
        </NextButton>
      </div>
      <ValidPassword
        show={showStatus}
        onSuccess={passwordConfirm}
        onClose={modalClose}
      />
      <DelConfirmModel
        text='密码本'
        show={showDelStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </div>
  );
}
