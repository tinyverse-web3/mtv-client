import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useAccountStore } from '@/store';

interface Props {
  show: boolean;
  btnText?: string;
  onConfirm: () => void;
  onClose?: () => void;
}
export const ConfirmDelModel = ({
  show,
  onConfirm,
  onClose,
  btnText = '确定',
}: Props) => {
  const [showModal, setShowModal] = useState(show);
  const closeHandler = () => {
    setShowModal(false);
    onClose?.();
  };
  const confirmHandler = async () => {
    await onConfirm();
    onClose?.();
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
          是否删除守护者？
        </Text>
      </Modal.Header>
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
