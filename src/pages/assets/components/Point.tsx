import { ROUTE_PATH } from '@/router';
import { Popover, Button, Radio } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

interface Props {
  label: string;
  value?: string | any;
  onPress?: () => void;
}
export const Point = () => {
  const nav = useNavigate();
  return (
    <div className='p-4'>
      <div className='h-20'>
        <div>余额：0.0</div>
      </div>
      <div className='flex justify-center'>
        <Button auto flat>
          转账
        </Button>
        <Button auto flat className='ml-8'>
          收款
        </Button>
      </div>
    </div>
  );
};
