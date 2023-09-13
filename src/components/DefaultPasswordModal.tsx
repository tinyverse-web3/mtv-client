import { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
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
      closeButton
      size='xs'
      classNames={{
        wrapper: 'items-center',
      }}
      isDismissable={false}
      isOpen={showModal}
      onClose={closeHandler}>
      <ModalContent>
        <ModalHeader>
          <div className='text-center w-full'>
            {t('common.password.default_modal_text')}：
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='text-center text-red-400 text-[20px]'>123456</div>
          <div className='text-center text-red-400 text-xs'>
            {t('common.password.hint_one')}
          </div>
        </ModalBody>
        <ModalFooter>
          {/* <Button auto flat color='error' onClick={closeHandler}>
          {t('common.cancel')}
        </Button> */}
          <Button size='xs' color='primary' onClick={confirmHandler}>
            {t('common.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
