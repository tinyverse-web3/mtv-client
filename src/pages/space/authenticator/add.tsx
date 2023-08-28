import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Select } from '@/components/form/Select';
import LayoutThird from '@/layout/LayoutThird';
import { Text, Container, Row, Button } from '@nextui-org/react';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Edit() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  const types = [
    {
      label: '基于时间',
      value: 1,
    },
    {
      label: '基于计数器',
      value: 2,
    },
  ];
  const nameChange = (e: any) => {
    setName(e?.trim());
  };
  const keyChange = (e: any) => {
    setKey(e?.trim());
  };
  const generateGoogleSecret = async () => {
    const { code, msg, data } = await account.generateGoogleSecret();
    if (code === '000000') {
      setKey(data);
    } else {
      toast.error(msg);
    }
  };
  const add = async () => {
    const { code, msg } = await account.addAuthenticator({
      Account: name,
      Secret: key,
    });
    if (code === '000000') {
      toast.success(t('common.toast.add_success'));
      nav(-1);
    } else {
      toast.error(msg);
    }
  };
  return (
    <LayoutThird title={t('pages.space.authenticator.add_title')}>
      <div className='p-6'>
        <Row className='mb-8' justify='center'>
          <Input
            value={name}
            maxLength={300}
            onChange={nameChange}
            placeholder={t('pages.space.authenticator.detail_name')}
          />
        </Row>
        <Row className='mb-8' align='center'>
          <Input
            value={key}
            maxLength={300}
            onChange={keyChange}
            placeholder={t('pages.space.authenticator.detail_key')}
          />
          <div
            className='i-mdi-plus text-blue-5 w-6 h-6 ml-4'
            onClick={generateGoogleSecret}></div>
        </Row>
        {/* <Row className='mb-8' justify='center'>
          <Select list={types} placeholder='秘钥类型'></Select>
        </Row> */}
        <Row className='' justify='center'>
          <Button
            color='secondary'
            disabled={!name}
            className='m-auto mb-6 w-full'
            onPress={add}
            size='md'>
            {t('common.confirm')}
          </Button>
        </Row>
      </div>
    </LayoutThird>
  );
}
