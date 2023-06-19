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
    <div className=''>
      
    </div>
  );
};
