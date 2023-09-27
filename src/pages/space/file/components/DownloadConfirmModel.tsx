import { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useTranslation } from 'react-i18next';

interface Props {
  show: boolean;
  onConfirm: () => void;
  onClose?: () => void;
}
export const DownloadConfirmModel = ({ show, onConfirm, onClose }: Props) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(show);
  const closeHandler = () => {
    setShowModal(false);
    onClose?.();
    document.body.removeAttribute('style');
  };
  const confirmHandler = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.log(error);
    }
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
        <ModalBody>{t('pages.space.file.download_toast')}</ModalBody>

        <ModalFooter>
          <Button
            color='red'
            variant='ghost'
            size='sm'
            onPress={closeHandler}>
            {t('common.cancel')}
          </Button>
          <Button
            size='sm'
            onPress={confirmHandler}
            className='ml-6'>
            {t('common.download')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
