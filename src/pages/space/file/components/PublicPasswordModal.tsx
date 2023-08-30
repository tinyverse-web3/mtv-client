import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useAccountStore } from '@/store';

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
    setPassword(e.target.value);
  };
  useEffect(() => {
    setShowModal(show);
  }, [show]);
  return (
    <Modal
      className='max-w-90% mx-auto'
      autoMargin
      closeButton
      open={showModal}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          输入共享文件加密密码
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input.Password
          clearable
          bordered
          fullWidth
          maxLength={6}
          aria-label='密码'
          color='primary'
          size='lg'
          value={password}
          onChange={passwordChange}
          placeholder='密码'
          contentLeft={<div className='i-mdi-shield-outline color-current' />}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color='error' onPress={closeHandler}>
          取消
        </Button>
        <Button auto onPress={confirmHandler}>
          {btnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
