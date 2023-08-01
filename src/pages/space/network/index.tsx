import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Progress } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';
import { IndexItem } from './components/IndexItem';
import { ROUTE_PATH } from '@/router';

export default function NetworIndex() {
  const nav = useNavigate();
  useEffect(() => {}, []);
  const toDkvsExpansion = () => {};
  const toIpfsExpansion = () => {};
  const toIpfsList = () => {
    nav(ROUTE_PATH.SPACE_NETWORK_LIST);
  };
  const toDkvsList = () => {
    nav(ROUTE_PATH.SPACE_NETWORK_LIST);
  };
  return (
    <LayoutThird title='网络数据'>
      <div className='p-4'>
        <div className='mb-4'>
          <IndexItem
            title='IPFS'
            toExpansion={toIpfsExpansion}
            toDetail={toIpfsList}
          />
        </div>
        <div>
          <IndexItem
            title='DKVS'
            toExpansion={toDkvsExpansion}
            toDetail={toDkvsList}
          />
        </div>
      </div>
    </LayoutThird>
  );
}
