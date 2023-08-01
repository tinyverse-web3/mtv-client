import React, { useState } from 'react';
import { ListItem } from './components/ListItem';

const NetworkList: React.FC = () => {
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

  const filteredNetworkItems = networkItems.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className='p-4'>
      <input
        type='text'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {filteredNetworkItems.map((item, index) => (
        <ListItem
          key={index}
          title={item.title}
          size={item.size}
          redundancy={item.redundancy}
          saveTime={item.saveTime}
          expireTime={item.expireTime}
          description={item.description}
          onDelete={() => handleDelete(index)}
        />
      ))}
    </div>
  );
};

export default NetworkList;
