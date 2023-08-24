import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Progress } from '@nextui-org/react';
import { calcSize } from '@/lib/utils';
import { format } from 'date-fns';
interface Props {
  Key: string;
  Size: number;
  Redundancy: string;
  CreateTime: number;
  // expireTime: string;
  // description: string;
  onDelete: () => void;
  onClick: () => void;
}
export function ListItem({
  Key,
  Size = 0,
  Redundancy,
  CreateTime,
  // expireTime,
  // description,
  onDelete,
  onClick,
}: Props) {
  const delHandler = (e: any) => {
    e.stopPropagation();
    onDelete?.();
  };
  const sizeText = useMemo(() => {
    return calcSize(Size);
  }, [Size]);
  const createTimeText = useMemo(() => {
    if (CreateTime) {
      try {
        return format(new Date(CreateTime * 1000), 'yyyy-MM-dd HH:mm:ss');
      } catch (error) {
        return
      }
    }
    return;
  }, [Size]);
  return (
    <Card variant="bordered"  className='mb-4'>
      <Card.Body className='relative' onClick={onClick}>
        <div className='text-4 break-all'>{Key}</div>
        <div className=''>
          <div>
            <span>大小：</span>
            <span>{sizeText}</span>
          </div>
          <div>
            <span>冗余度：</span>
            <span>{Redundancy}</span>
          </div>
          <div>
            <span>保存时间：</span>
            <span>{createTimeText}</span>
          </div>
          <div>
            <span>过期时间：</span>
            {/* <span>{expireTime}</span> */}
          </div>
          <div>
            <span>说明：</span>
            {/* <span>{description}</span> */}
          </div>
        </div>
        <div
          className='i-mdi-trash-can-outline absolute right-1 top-1/2 -translate-1/2 w-6 h-6 text-red'
          onClick={delHandler}></div>
      </Card.Body>
    </Card>
  );
}
