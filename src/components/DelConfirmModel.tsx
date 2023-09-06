import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useTranslation } from 'react-i18next';

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
  btnText,
  text,
}: Props) => {
  const { t } = useTranslation();
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
      autoMargin
      closeButton
      open={showModal}
      onClose={closeHandler}>
      {text && (
        <Modal.Body>
          <Text size={16} className='text-center'>
            {t('common.delete_hint')}
            {text}？
          </Text>
        </Modal.Body>
      )}

      <Modal.Footer>
        <Button auto flat color='error' size='sm' onPress={closeHandler}>
          {t('common.cancel')}
        </Button>
        <Button auto onPress={confirmHandler} size='sm' className='ml-6'>
          {btnText || t('common.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
