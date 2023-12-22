import { useState, useRef, useEffect } from 'react';
import { Password } from '@/components/form/Password';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { Icon } from '@iconify/react'
import { Button } from '@/components/form/Button';

interface Props {
  show: boolean;
  btnText?: string;
  onClose?: () => void;
  onChange: (password: string) => void;
}
export const PublicPasswordModal = ({
  show,
  onChange,
  onClose,
  btnText = '上传',
}: Props) => {
  const [showModal, setShowModal] = useState(show);
  const [password, setPassword] = useState('');
  const closeHandler = () => {
    setPassword('');
    setShowModal(false);
    onClose?.();
    document.body.removeAttribute('style');
  };
  const confirmHandler = async () => {
    await onChange(password);
    closeHandler();
  };
  const passwordChange = (e: any) => {
    setPassword(e);
  };
  useEffect(() => {
    setShowModal(show);
  }, [show]);
  return (
    <Modal
      closeButton
      size='xs'
      classNames={{
        wrapper: 'items-center',
      }}
      isDismissable={false}
      isOpen={showModal}
      onClose={closeHandler}>
      <ModalContent>
        <ModalHeader>输入共享文件加密密码</ModalHeader>
        <ModalBody>
          <Password
            maxLength={6}
            value={password}
            onChange={passwordChange}
            placeholder='密码'
            contentLeft={<Icon icon='mdi:shield-outline color-current' />}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color='red'
            variant='ghost'
            size='sm'
            onPress={closeHandler}>
            取消
          </Button>
          <Button
            size='sm'
            onPress={confirmHandler}
            className='ml-6'>
            {btnText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
