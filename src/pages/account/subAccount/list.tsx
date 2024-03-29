import { Card } from '@nextui-org/react';
6;
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useEffect, useState } from 'react';
import { useList } from 'react-use';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';

export default function UserPhrase() {
  const nav = useNavigate();
  const [list, { set: setList }] = useList<any>([]);
  const getSubAccount = async () => {
    // const list = await account.getAllSubAccount();
    // setList(list);
  };
  const toAdd = () => {
    nav(ROUTE_PATH.ACCOUNT_SUBACCOUNT_EDIT);
  };
  const deleteHandler = async (item: any) => {
    console.log('删除');
    // await account.deleteSubAccount(item);
    await getSubAccount();
    toast.success('删除成功');
  };
  const toDetail = (item: any) => {
    nav(`${ROUTE_PATH.ACCOUNT_SUBACCOUNT_EDIT}?id=${item.id}`);
  };
  useEffect(() => {
    getSubAccount();
  }, []);
  return (
    <LayoutThird
      title='子账号列表'
      path={ROUTE_PATH.ACCOUNT}
      rightContent={
        <Icon
          icon='mdi:plus-circle-outline'
          onClick={toAdd}
          className=' text-5'></Icon>
      }>
      <div className='p-4'>
        {list.map((item) => (
          <Card key={item.id} className='mb-4'>
            <div className='flex justify-between items-center py-2 px-4'>
              <div>
                <h5>{item.label}</h5>
                <div className='text-gray-500'>{item.type}</div>
              </div>
              <div className='flex'>
                <Icon
                  icon='mdi:pencil-outline'
                  className=' text-6 mr-4'
                  onClick={() => toDetail(item)}
                />
                <div
                  className='mdi:delete-outline text-6'
                  onClick={() => deleteHandler(item)}></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </LayoutThird>
  );
}
