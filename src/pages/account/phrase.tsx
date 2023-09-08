import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Checkbox,
  Card,
  CardBody,
} from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import { useHost } from '@/lib/hooks';
import { download } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAccountStore } from '@/store';
import { toast } from 'react-hot-toast';

export default function UserPhrase() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [checked, setChecked] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getLocalAccountInfo, accountInfo } = useAccountStore(
    (state) => state,
  );
  const host = useHost();
  const toVerify = () => {
    nav(ROUTE_PATH.ACCOUNT_PHRASE_VERIFY);
  };
  const [mnemonic, setMnemonic] = useState<string>('');
  const getMnemonic = async () => {
    const _mnemonic = await account.getMnemonic();
    setMnemonic(_mnemonic);
  };
  const checkboxChange = (e: boolean) => {
    if (!e) {
      setShowModal(true);
    } else {
      setChecked(e);
    }
  };
  const closeHandler = () => {
    setShowModal(false);
  };
  const confirmHandler = () => {
    setShowModal(false);
    setChecked(false);
  };
  const url = useMemo(() => {
    return `${host}/sdk/downloadMnemonic`;
  }, [host]);
  const downloadFile = async () => {
    if (!accountInfo.hasFeatureData) {
      toast(t('pages.account.toast.no_private'));
      return;
    }
    setLoading(true);
    await download(url, 'mnemonic.txt');
    if (window.JsBridge) {
      window.JsBridge.getDownloadStatus(async ({ code }: any) => {
        if (code == 0) {
          await getLocalAccountInfo();
          toast.success(t('pages.account.phrase.download_success'));
        } else {
          toast.success(t('pages.account.phrase.download_error'));
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMnemonic();
  }, []);
  return (
    <LayoutThird title={t('pages.account.phrase.backup')}>
      <div className='p-4'>
        <div>
          <Checkbox
            className='mb-3'
            aria-label='checkbox'
            isSelected={checked}
            onValueChange={checkboxChange}>
            <div className='text-3'>{t('pages.account.phrase.hint_one')}</div>
          </Checkbox>
        </div>
        <Modal
          closeButton
          size='xs'
          classNames={{
            wrapper: 'items-center',
          }}
          isOpen={showModal}
          onClose={closeHandler}>
          <ModalContent>
            <ModalBody>{t('pages.account.phrase.hint_two')}</ModalBody>

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
        {checked ? (
          <>
            <Button
              onClick={downloadFile}
              loading={loading}
              className='w-full'
              size='lg'>
              {t('pages.account.phrase.download_text')}
            </Button>
          </>
        ) : (
          <>
            <div className='text-4 mb-4'>
              {t('pages.account.phrase.hint_two')}
            </div>
            <Card className='mb-4'>
              <CardBody>
                <div>{mnemonic}</div>
              </CardBody>
            </Card>
            <Button onClick={toVerify} className='w-full' size='lg'>
              {t('common.next_step')}
            </Button>
          </>
        )}
      </div>
    </LayoutThird>
  );
}
