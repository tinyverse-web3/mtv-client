import { useState, useRef, useEffect } from 'react';
import { Modal, ModalContent, ModalBody, ModalFooter, ModalHeader } from '@nextui-org/react';
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
      closeButton
      size='xs'
      classNames={{
        wrapper: 'items-center',
      }}
      isDismissable={false}
      isOpen={showModal}
      onClose={closeHandler}>
      <ModalContent>
        <ModalHeader/>
        {text && (
          <ModalBody>
            {t('common.delete_hint')}
            {text}？
          </ModalBody>
        )}

        <ModalFooter>
          <Button
            color='danger'
            variant='light'
            size='xs'
            onPress={closeHandler}>
            {t('common.cancel')}
          </Button>
          <Button
            color='primary'
            size='xs'
            onPress={confirmHandler}
            className='ml-6'>
            {btnText || t('common.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
