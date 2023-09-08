import { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useAccountStore } from '@/store';
import { useTranslation } from 'react-i18next';

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
      isOpen={showModal}
      onClose={closeHandler}>
      <ModalContent>
        <ModalHeader>{t('pages.account.protector.delete_hint')}</ModalHeader>
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
            {t('common.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
