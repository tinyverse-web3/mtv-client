import { useState, useMemo } from 'react';
import { Checkbox, Text, Textarea } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
export default function protectorVerify() {
  const nav = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareA, setShareA] = useState('');
  const [shareB, setShareB] = useState('222');

  const submit = () => {
    // setChecked(e);
    nav(-1);
  };
  const disabled = useMemo(() => !(shareB && shareA), [shareA, shareB]);
  return (
    <LayoutThird title='添加守护者' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-6'>
        <Text className='text-14px mb-2'>守护者分片数据</Text>
        <Textarea
          fullWidth
          bordered
          minRows={4}
          value={shareA}
          className='mb-4'
          onChange={(e) => setShareB(e.target.value)}
          placeholder='守护者分片数据'
        />
        <Text className='text-14px mb-2'>服务器分片数据</Text>
        <Textarea
          fullWidth
          bordered
          readOnly
          minRows={4}
          className='mb-6'
          value={shareB}
          onChange={(e) => setShareB(e.target.value)}
          placeholder='用户分片'
        />
        <Button
          disabled={disabled}
          size='lg'
          loading={loading}
          className='mx-auto mb-2 w-full'
          onPress={submit}>
          恢复测试
        </Button>
      </div>
    </LayoutThird>
  );
}
