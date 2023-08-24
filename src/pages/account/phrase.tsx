import { Card, Text, Checkbox, Modal } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import { useHost } from '@/lib/hooks';
import { download } from '@/lib/utils';

export default function UserPhrase() {
  const nav = useNavigate();
  const [checked, setChecked] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    await download(url, 'mnemonic.txt');
    setLoading(false);
  };
  useEffect(() => {
    getMnemonic();
  }, []);
  return (
    <LayoutThird title='助记词备份'>
      <div className='p-4'>
        <div>
          <Checkbox
            className='mb-3'
            aria-label='checkbox'
            isSelected={checked}
            onChange={checkboxChange}>
            <Text className='text-3'>是否使用加密保险箱加密助记词</Text>
          </Checkbox>
        </div>
        <Modal
          className='max-w-70% mx-auto'
          blur
          autoMargin
          closeButton
          open={showModal}
          onClose={closeHandler}>
          <Modal.Body>
            <Text size={16} className='text-center'>
              直接显示和抄写助记词很危险，需要您投入更多的精力去保管助记词
            </Text>
          </Modal.Body>

          <Modal.Footer>
            <Button auto flat color='error' onPress={closeHandler}>
              取消
            </Button>
            <Button auto onPress={confirmHandler}>
              确定
            </Button>
          </Modal.Footer>
        </Modal>
        {checked ? (
          <>
            <Button
              onClick={downloadFile}
              loading={loading}
              className='w-full'
              size='lg'>
              下载加密文件
            </Button>
          </>
        ) : (
          <>
            <Text className='text-4 mb-4'>
              助记词非常重要，请妥善保管，注意不使用联网工具备份。
            </Text>
            <Card variant="bordered"  className='mb-4'>
              <Card.Body>
                <Text>{mnemonic}</Text>
              </Card.Body>
            </Card>
            <Button onClick={toVerify} className='w-full' size='lg'>
              下一步
            </Button>
          </>
        )}
      </div>
    </LayoutThird>
  );
}
