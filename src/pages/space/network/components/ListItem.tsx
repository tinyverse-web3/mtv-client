import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Progress } from '@nextui-org/react';
import { calcSize } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
interface Props {
  Key: string;
  Size: number;
  Redundancy: string;
  CreateTime: number;
  type?: string;
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
  type,
  // expireTime,
  // description,
  onDelete,
  onClick,
}: Props) {
  const { t} = useTranslation()
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
            <span>{t('pages.space.data.size_text')}：</span>
            <span>{sizeText}</span>
          </div>
          <div>
            <span>{t('pages.space.data.redundancy_text')}：</span>
            <span>{Redundancy}</span>
          </div>
          <div>
            <span>{t('pages.space.data.save_time')}：</span>
            <span>{createTimeText}</span>
          </div>
          {
            type !== 'ipfs' &&  <div>
            <span>{t('pages.space.data.expired_time')}：</span>
            {/* <span>{expireTime}</span> */}
          </div>
          }
         
          <div>
            <span>{t('pages.space.data.description')}：</span>
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
