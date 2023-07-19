import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useAccountStore } from '@/store';

interface Props {
  show: boolean;
  onChange: (password: string) => void;
}
export const ValidPassword = ({ show, onChange }: Props) => {
  const [showModal, setShowModal] = useState(show);
  const [password, setPassword] = useState('');
  const closeHandler = () => {
    setPassword('');
    setShowModal(false);
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
      blur
      autoMargin
      closeButton
      open={showModal}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          验证账号密码
        </Text>
      </Modal.Header   >
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
          确定
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
