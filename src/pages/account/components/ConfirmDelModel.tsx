import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
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
      className='max-w-90% mx-auto'
      autoMargin
      closeButton
      open={showModal}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          {t('pages.account.protector.delete_hint')}
        </Text>
      </Modal.Header>
      <Modal.Footer>
        <Button auto flat color='error' size='sm' onPress={closeHandler}>
          {t('common.cancel')}
        </Button>
        <Button auto onPress={confirmHandler} size='sm' className='ml-6'>
          {t('common.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
