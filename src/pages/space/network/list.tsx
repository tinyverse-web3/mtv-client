import React, { useState } from 'react';
import { ListItem } from './components/ListItem';
import { Input } from '@/components/form/Input';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';

const NetworkList: React.FC = () => {
  const nav = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [networkItems, setNetworkItems] = useState([
    {
      title: '文件1',
      size: '100MB',
      redundancy: '3',
      saveTime: '2022-01-01',
      expireTime: '2023-01-01',
      description: '这是文件1',
    },
    {
      title: '文件2',
      size: '200MB',
      redundancy: '2',
      saveTime: '2022-01-01',
      expireTime: '2023-01-01',
      description: '这是文件2',
    },
  ]);

  const handleDelete = (index: number) => {
    const newNetworkItems = [...networkItems];
    newNetworkItems.splice(index, 1);
    setNetworkItems(newNetworkItems);
  };
  const searchHandler = () => {};
  const filteredNetworkItems = networkItems.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase()),
  );
  const toDetail = (e: any) => {
    console.log(123);
    nav(ROUTE_PATH.SPACE_NETWORK_DETAIL);
  };
  return (
    <LayoutThird title='网络数据'>
      <div className='p-4'>
        {/* <div className='mb-4'>
          <Input
            value={searchText}
            aria-label='text'
            onChange={(e: any) => setSearchText(e.target)}
            fullWidth
            clearable
            rounded
            onKeyUp={searchHandler}
            placeholder='对方公钥'
          />
        </div> */}

        {filteredNetworkItems.map((item, index) => (
          <ListItem
            key={index}
            title={item.title}
            size={item.size}
            redundancy={item.redundancy}
            saveTime={item.saveTime}
            expireTime={item.expireTime}
            description={item.description}
            onClick={() => toDetail(item)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>
    </LayoutThird>
  );
};

export default NetworkList;
