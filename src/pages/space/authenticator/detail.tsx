import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import LayoutThird from '@/layout/LayoutThird';
import { Text, Container, Row } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import account from '@/lib/account/account';
import { DelConfirmModel } from '@/components/DelConfirmModel';
import { toast } from 'react-hot-toast';
export default function Detail() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [showStatus, setShowStatus] = useState(false);
  const getAccountSecret = async () => {
    const { code, data } = await account.getAuthenticatorSecret({
      AccountName: id,
    });
    if (code === '000000') {
      setKey(data);
    }
  };
  const showDelModal = async (e: any) => {
    setShowStatus(true);
  };
  const remove = async () => {
    const { code, msg } = await account.delAuthenticatorAccount({
      AccountName: id,
    });

    if (code === '000000') {
      toast.success('删除成功');
    } else {
      toast.error(msg);
    }
  };
  const delConfirm = async () => {
    await remove();
  };
  const onClose = async () => {
    setShowStatus(false);
  };
  useEffect(() => {
    if (id) {
      setName(id);
      getAccountSecret();
    }
  }, [id]);
  return (
    <LayoutThird title='账号详情'>
      <div className='p-6'>
        <Row className='mb-8' justify='center'>
          <Input value={name} maxLength={300} readOnly placeholder='账户名' />
        </Row>
        <Row className='mb-8' justify='center'>
          <Input value={key} maxLength={300} readOnly placeholder='您的秘钥' />
        </Row>
        <div>
          <Button className='w-full' onClick={showDelModal}>
            删除
          </Button>
        </div>
        <DelConfirmModel
          text='谷歌验证器'
          show={showStatus}
          onConfirm={delConfirm}
          onClose={onClose}
        />
      </div>
    </LayoutThird>
  );
}
