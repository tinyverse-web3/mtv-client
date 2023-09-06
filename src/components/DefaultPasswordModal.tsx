import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input, Image } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useAccountStore, useGlobalStore } from '@/store';
import { useTranslation } from 'react-i18next';

export const DefaultPasswordModal = () => {
  const { accountInfo } = useAccountStore((state) => state);
  const { defaultPasswordShow, setDefaultPasswordShow } = useGlobalStore(
    (state) => state,
  );
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const closeHandler = () => {
    document.body.removeAttribute('style');
    setDefaultPasswordShow(true);
    setShowModal(false);
  };
  const confirmHandler = async () => {
    closeHandler();
  };
  useEffect(() => {
    if (accountInfo.isDefaultPwd && !defaultPasswordShow) {
      setShowModal(true);
    }
  }, [accountInfo.isDefaultPwd, defaultPasswordShow]);
  return (
    <Modal
      className='max-w-90% mx-auto'
      autoMargin
      closeButton
      open={showModal}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={16}>
          {t('common.password.default_modal_text')}：
        </Text>
      </Modal.Header>
      <Modal.Body>
        <div className='text-center text-red text-20px mb-2'>123456</div>
        <div className='text-center text-red text-14px'>
          {t('common.password.hint_one')}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button auto flat color='error' onClick={closeHandler}>
          {t('common.cancel')}
        </Button> */}
        <Button auto onClick={confirmHandler}>
          {t('common.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
