import { useMemo } from 'react';
import { ROUTE_PATH } from '@/router';
import { Popover, Button, Radio } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAccountStore } from '@/store';
import { Address } from '@/components/Address';
interface Props {
  label: string;
  value?: string | any;
  onPress?: () => void;
}
export const HeaderAccount = () => {
  const nav = useNavigate();
  const { account, web3AccountSelect, setWeb3Select, accountInfo } = useAccountStore(
    (state) => state,
  );
  const list = useMemo(() => {
    const web3SubAccount = accountInfo.subAccount.filter(
      (v) => v.type === 'web3',
    );
    return [accountInfo.pointAccount, ...web3SubAccount] as any;
  }, [account]);
  const subAccount = useMemo<any>(() => {
    let index = list.findIndex((v: any) => v?.address === web3AccountSelect);
    index = Math.max(index, 0);
    return list[index];
  }, [web3AccountSelect, list]);
  const subAccountChange = (value: string) => {
    setWeb3Select(value);
  };
  const toAddSubAccount = () => {
    nav(ROUTE_PATH.ACCOUNT_SUBACCOUNT_EDIT);
  };
  return (
    <div className='h-14 border-b border-b-solid border-b-gray-200'>
      <div className='h-full flex justify-between items-center'>
        <div className='text-1 w-30'></div>
        <div className='text-center'>
          <div>{subAccount?.label}</div>
          <div>
            <Address address={subAccount?.address} />
          </div>
        </div>
        <div className='text-1 w-30 flex justify-center'>
          <Popover>
            <Popover.Trigger>
              <Button auto flat size='xs'>
                切换账号
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <div className='p-2'>
                <div className='mb-2'>
                  <Radio.Group
                    size='xs'
                    onChange={subAccountChange}
                    value={subAccount.address}>
                    {list.map((v: any) => (
                      <Radio key={v.address} value={v.address}>
                        {v.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
                <div>
                  <Button auto flat size='xs' onClick={toAddSubAccount}>
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
