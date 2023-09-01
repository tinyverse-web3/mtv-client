import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
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
      <Modal.Body>
        <Text size={16} className='text-center'>
          {t('pages.space.file.download_toast')}
        </Text>
      </Modal.Body>

      <Modal.Footer>
        <Button auto flat color='error' size='sm' onPress={closeHandler}>
          {t('common.cancel')}
        </Button>
        <Button auto onPress={confirmHandler} size='sm'>
          {t('common.download')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
