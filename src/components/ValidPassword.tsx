import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input, Image } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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
    setPassword(e.target.value);
  };
  const startBiometric = async () => {
    window?.JsBridge.startBiometric(({ code, message, data }: any) => {
      if (code === 0) {
        toast.success(t('common.password.verify_success'));
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
      className='max-w-90% mx-auto'
      blur
      autoMargin
      closeButton
      open={showModal}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          {t('common.password.verify_text')}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <div className='flex items-center'>
          <Input.Password
            clearable
            bordered
            fullWidth
            aria-label={t('common.password.title')}
            color='primary'
            size='lg'
            value={password}
            onChange={passwordChange}
            placeholder={t('common.password.title')}
            contentLeft={<div className='i-mdi-shield-outline color-current' />}
          />
          {showBiometric && setupBiometric && (
            <Image
              onClick={startBiometric}
              src='/figer.png'
              className='w-10 h-10 cursor-pointer ml-4'
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color='error' onPress={closeHandler}>
          {t('common.cancel')}
        </Button>
        <Button auto onPress={confirmHandler}>
          {t('common.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
