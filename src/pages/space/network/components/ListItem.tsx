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
  PinStatus: number;
  ValidTime: string;
  Cid: string;
  description: string;
  onDelete: () => void;
  onClick: () => void;
}
export function ListItem({
  Key,
  Size = 0,
  Redundancy,
  CreateTime,
  type,
  Cid,
  PinStatus,
  ValidTime,
  description,
  onDelete,
  onClick,
}: Props) {
  const { t } = useTranslation();
  const delHandler = (e: any) => {
    e.stopPropagation();
    onDelete?.();
  };
  const pinStatusMap: any = {
    0: t('pages.space.data.status.unknow'),
    1: t('pages.space.data.status.init'),
    2: t('pages.space.data.status.err'),
    3: t('pages.space.data.status.work'),
    4: t('pages.space.data.status.pinned'),
    5: t('pages.space.data.status.timout'),
  };
  const statusColorMap: any = {
    0: '#808080',
    1: '#FFFF00',
    2: '#FF0000',
    3: '#00FF00',
    4: '#00BFFF',
    5: '#FFA500',
  };
  const sizeText = useMemo(() => {
    return calcSize(Size);
  }, [Size]);
  const createTimeText = useMemo(() => {
    if (CreateTime) {
      try {
        return format(new Date(CreateTime), 'yyyy-MM-dd HH:mm:ss');
      } catch (error) {
        return;
      }
    }
    return;
  }, [CreateTime]);
  const validTimeText = useMemo(() => {
    if (ValidTime) {
      try {
        return format(new Date(ValidTime), 'yyyy-MM-dd HH:mm:ss');
      } catch (error) {
        return;
      }
    }
    return;
  }, [ValidTime]);
  return (
    <Card variant='bordered' className='mb-4'>
      <Card.Body className='relative' onClick={onClick}>
        <div className='text-4 break-all'>{Key}</div>
        <div className=''>
          {!!Cid && (
            <div>
              <span>{t('pages.space.data.cid')}：</span>
              <span>{Cid}</span>
            </div>
          )}
          {!!Size && (
            <div>
              <span>{t('pages.space.data.size_text')}：</span>
              <span>{sizeText}</span>
            </div>
          )}

          {PinStatus !== null && PinStatus !== undefined && type === 'ipfs' && (
            <div>
              <span>{t('pages.space.data.status.title')}：</span>
              <span style={{ color: statusColorMap[PinStatus] }}>
                {pinStatusMap[PinStatus]}
              </span>
            </div>
          )}
          <div>
            <span>{t('pages.space.data.redundancy_text')}：</span>
            <span>{Redundancy || 0}</span>
          </div>
          <div>
            <span>{t('pages.space.data.save_time')}：</span>
            <span>{createTimeText}</span>
          </div>
          {type !== 'ipfs' && !!ValidTime && (
            <div>
              <span>{t('pages.space.data.expired_time')}：</span>
              <span>{validTimeText}</span>
            </div>
          )}
          {!!description && (
            <div>
              <span>{t('pages.space.data.description')}：</span>
              <span>{description}</span>
            </div>
          )}
        </div>
        {/* <div
          className='i-mdi-trash-can-outline absolute right-1 top-1/2 -translate-1/2 w-6 h-6 text-red'
          onClick={delHandler}></div> */}
      </Card.Body>
    </Card>
  );
}
