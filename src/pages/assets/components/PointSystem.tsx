import { ROUTE_PATH } from '@/router';
import { Popover, Button, Radio } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
interface Props {
  label: string;
  value?: string | any;
  onPress?: () => void;
}
export const HeaderAccount = () => {
  const nav = useNavigate();
  const subAccount = {
    label: '子账户',
  };
  const list = [];
  const toAddSubAccount = () => {
    nav(ROUTE_PATH.ACCOUNT_SUBACCOUNT_EDIT);
  };
  return (
    <div className='h-12 border-b border-b-solid border-b-gray-200'>
      <div className='h-full flex justify-between items-center'>
        <div className='text-1 w-30'></div>
        <div>{subAccount.label}</div>
        <div className='text-1 w-30 flex justify-center'>
          <Popover>
            <Popover.Trigger>
              <Button auto flat>
                切换账号
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <div className='p-2'>
                <div className='mb-2'>
                  <Radio.Group size="xs" defaultValue='A'>
                    <Radio value='A'>Option A</Radio>
                    <Radio value='B'>Option B</Radio>
                    <Radio value='C'>Option C</Radio>
                    <Radio value='D'>Option D</Radio>
                  </Radio.Group>
                </div>
                <div>
                  <Button auto flat onClick={toAddSubAccount}>
                    添加子账号
                  </Button>
                </div>
              </div>
            </Popover.Content>
          </Popover>
        </div>
      </div>
    </div>
  );
};
