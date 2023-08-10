import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';

interface Props {
  show: boolean;
  btnText?: string;
  text: string;
  onConfirm: () => void;
  onClose?: () => void;
}
export const DelConfirmModel = ({
  show,
  onConfirm,
  onClose,
  btnText = '确定',
  text, 
}: Props) => {
  const [showModal, setShowModal] = useState(show);
  const closeHandler = () => {
    setShowModal(false);
    onClose?.();
    document.body.removeAttribute('style');
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
      className='max-w-70% mx-auto'
      blur
      autoMargin
      closeButton
      open={showModal}
      onClose={closeHandler}>
      {text && (
        <Modal.Body>
          <Text size={16} className='text-center'>是否删除{text}？</Text>
        </Modal.Body>
      )}

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
