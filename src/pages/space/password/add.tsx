import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import LayoutThird from '@/layout/LayoutThird';
import { Input as NextInput, Row, Button } from '@nextui-org/react';
import { usePasswordStore, useAccountStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import { useSearchParams } from 'react-router-dom';
import { useMap } from 'react-use';
import { toast } from 'react-hot-toast';

export default function Edit() {
  const nav = useNavigate();
  const { add, getById, list, update } = usePasswordStore((state) => state);
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id') as string;
  const [data, { set, setAll, remove, reset }] = useMap({
    Id: id,
    Title: '',
    Account: '',
    Password: '',
    Url: '',
  });
  const saveHandler = async (e: any) => {
    if (type === 'add') {
      await add(data);
    } else {
      await update(data);
    }
    nav(-1);
  };
  useEffect(() => {
    if (id) {
      const detail = getById(id);
      setAll(detail as any);
    }
  }, [id]);
  return (
    <LayoutThird title={`${type ==='add' ? '新建' : '编辑'}密码箱`}>
      <div className='p-6'>
        <Row className='mb-8' justify='center' align='center'>
          <span className='w-16'>标题</span>
          <Input
            value={data.Title}
            maxLength={300}
            onChange={(e: string) => set('Title', e?.trim())}
            placeholder='标题'
          />
        </Row>
        <Row className='mb-8' justify='center' align='center'>
          <span className='w-16'>账号</span>
          <Input
            value={data.Account}
            maxLength={300}
            onChange={(e: string) => set('Account', e?.trim())}
            placeholder='账号'
          />
        </Row>
        <Row className='mb-8' justify='center' align='center'>
          <span className='w-16'>密码</span>
          <NextInput.Password
            value={data.Password}
            fullWidth
            maxLength={300}
            className=''
            onChange={(e: any) => set('Password', e.target.value?.trim())}
            placeholder='密码'
          />
        </Row>
        <Row className='mb-8' justify='center' align='center'>
          <span className='w-16'>网址</span>
          <Input
            value={data.Url}
            maxLength={300}
            onChange={(e: string) => set('Url', e?.trim())}
            placeholder='网址'
          />
        </Row>
        {/* <Row className='mb-8' justify='center'>
          <span className='w-16'>备注</span>
          <Textarea
            value={data.remark}
            maxLength={300}
            onChange={(e: string) => set('remark', e?.trim())}
            placeholder='备注'
          />
        </Row> */}
        <Row className='' justify='center'>
          <Button
            color='secondary'
            disabled={!data.Account || !data.Password || !data.Title}
            className='m-auto w-full'
            onPress={saveHandler}
            size='md'>
            保存
          </Button>
        </Row>
      </div>
    </LayoutThird>
  );
}
