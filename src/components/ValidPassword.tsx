import { useState, useRef, useEffect } from 'react';
import { Password } from '@/components/form/Password';
import {
  Modal,
  Image,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
interface Props {
  show: boolean;
  showBiometric?: boolean;
  onClose?: () => void;
  onSuccess?: (password: string) => void;
}
export const ValidPassword = ({
  show,
  onSuccess,
  onClose,
  showBiometric = true,
}: Props) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(show);
  const [password, setPassword] = useState('');
  const [setupBiometric, setSetupBiometric] = useState(false);
  const closeHandler = () => {
    setPassword('');
    onClose?.();
    document.body.removeAttribute('style');
    setShowModal(false);
  };
  const confirmHandler = async () => {
    await verifyPassword(password);
  };
  const verifyPassword = async (pwd: string) => {
    console.log(123);
    const { code, msg } = await account.checkPassword(pwd);
    if (code === '000000') {
      onSuccess?.(pwd);
      toast.success(t('common.password.verify_success'));
      closeHandler();
    } else {
      toast.error(msg);
    }
  };
  const passwordChange = (e: any) => {
    setPassword(e);
  };
  const startBiometric = async () => {
    window?.JsBridge.startBiometric(({ code, message, data }: any) => {
      if (code === 0) {
        // toast.success(t('common.password.verify_success'));
        verifyPassword(data);
      } else {
        toast.error(message);
      }
    });
  };
  const getBiometricsSetUp = () => {
    if (window?.JsBridge) {
      window?.JsBridge.isBiometricsSetUp(({ code, message }: any) => {
        console.log('系统是否设置了生物识别');
        console.log(code, message);
        if (code === 0) {
          setSetupBiometric(true);
        } else {
          setSetupBiometric(false);
        }
      });
    }
  };
  useEffect(() => {
    getBiometricsSetUp();
  }, []);
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
        <ModalHeader>{t('common.password.verify_text')}</ModalHeader>
        <ModalBody>
          <div className='flex items-center'>
            <Password
              color='primary'
              size='lg'
              value={password}
              onChange={passwordChange}
              placeholder={t('common.password.title')}
              contentLeft={<Icon icon='mdi:shield-outline color-current' />}
            />
            {showBiometric && setupBiometric && (
              <Image
                onClick={startBiometric}
                src='/figer.png'
                className='w-10 h-10  ml-4'
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color='red'
            variant='ghost'
            size='sm'
            onClick={closeHandler}>
            {t('common.cancel')}
          </Button>
          <Button
            size='sm'
            onClick={confirmHandler}
            className='ml-6'>
            {t('common.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
