import { useEffect, useMemo } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { calcSize } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react'
interface Props {
  Key: string;
  Size: number;
  Redundancy: string;
  CreateTime: number;
  type?: string;
  PinStatus: number;
  ValidTime: number;
  Cid: string;
  description: string;
  onClick: () => void;
}
export function ListItem({
  Key,
  Size = 0,
  Redundancy,
  CreateTime,
  type,
  Cid,
  PinStatus = 0,
  ValidTime,
  description,
  onClick,
}: Props) {
  const { t } = useTranslation();

  const pinStatusMap: any = {
    0: t('pages.space.data.status.unknow'),
    1: t('pages.space.data.status.init'),
    2: t('pages.space.data.status.err'),
    3: t('pages.space.data.status.work'),
    4: t('pages.space.data.status.pinned'),
    5: t('pages.space.data.status.timout'),
  };
  const statusColorMap: any = {
    0: '#FF0000',
    1: '#FF0000',
    2: '#FF0000',
    3: '#FF0000',
    4: '#00BFFF',
    5: '#FFA500',
  };
  const sizeText = useMemo(() => {
    return calcSize(Size);
  }, [Size]);
  const createTimeText = useMemo(() => {
    if (CreateTime) {
      try {
        return format(new Date(CreateTime * 1000), 'yyyy-MM-dd HH:mm:ss');
      } catch (error) {
        return;
      }
    }
    return;
  }, [CreateTime]);
  const validTimeText = useMemo(() => {
    if (ValidTime) {
      try {
        return format(new Date(ValidTime * 1000), 'yyyy-MM-dd HH:mm:ss');
      } catch (error) {
        return;
      }
    }
    return;
  }, [ValidTime]);
  return (
    <Card className='mb-4'>
      <CardBody className='relative' onClick={onClick}>
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
      </CardBody>
    </Card>
  );
}
