import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Progress } from '@nextui-org/react';

interface Props {
  title: string;
  size: string;
  redundancy: string;
  saveTime: string;
  expireTime: string;
  description: string;
  onDelete: () => void;
  onClick: () => void;
}
export function ListItem({
  title,
  size,
  redundancy,
  saveTime,
  expireTime,
  description,
  onDelete,
  onClick,
}: Props) {
  const delHandler = (e: any) => {
    e.stopPropagation();
    onDelete?.();
  };
  return (
    <Card className='mb-4'>
      <Card.Body className='relative' onClick={onClick}>
        <div className='text-4'>{title}</div>
        <div className='text-2'>
          <div>
            <span>大小：</span>
            <span>{size}</span>
          </div>
          <div>
            <span>冗余度：</span>
            <span>{redundancy}</span>
          </div>
          <div>
            <span>保存时间：</span>
            <span>{saveTime}</span>
          </div>
          <div>
            <span>过期时间：</span>
            <span>{expireTime}</span>
          </div>
          <div>
            <span>说明：</span>
            <span>{description}</span>
          </div>
        </div>
        <div
          className='i-mdi-trash-can-outline absolute right-1 top-1/2 -translate-1/2 w-6 h-6 text-red'
          onClick={delHandler}></div>
      </Card.Body>
    </Card>
  );
}
