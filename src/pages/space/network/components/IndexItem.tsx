import { calcSize } from '@/lib/utils';
import { Button } from '@/components/form/Button';
import { Card, CardBody, Progress } from '@nextui-org/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataStatusBadge } from '../../components/DataStatusBadge';
interface Props {
  title: string;
  summary: any;
  type: string;
  toDetail?: () => void;
  toExpansion?: () => void;
}
export function IndexItem({
  title,
  toDetail,
  toExpansion,
  summary,
  type,
}: Props) {
  const { t } = useTranslation();
  const usedSize = useMemo(() => {
    if (summary.used) {
      return calcSize(summary.used);
    }
    return 0;
  }, [summary.used]);
  const totalSpace = useMemo(() => {
    console.log(summary.totalSpace);
    if (summary.totalSpace) {
      return calcSize(summary.totalSpace);
    }
    return 0;
  }, [summary.totalSpace]);
  console.log(totalSpace);
  const sizePercent = useMemo(() => {
    if (summary.used && summary.totalSpace) {
      return Math.ceil((summary.used / summary.totalSpace) * 100);
    } else {
      return 0;
    }
  }, [summary.used, summary.totalSpace]);
  const numPercent = useMemo(() => {
    if (summary.usedItem && summary.total) {
      return Math.ceil((summary.usedItem / summary.total) * 100);
    } else {
      return 0;
    }
  }, [summary.usedItem, summary.total]);
  return (
    <div>
      <div className='mb-1'>{title}</div>
      <Card>
        <CardBody>
          <div className='relative'>
            {type === 'ipfs' && (
              <div className='absolute -top-2 -right-2'>
                <DataStatusBadge />
              </div>
            )}

            <div className='mb-2'>
              <div className='mb-2 text-3 break-keep '>
                {t('common.space')}：{usedSize}
                {type === 'ipfs' ? `/${totalSpace}(${sizePercent}%)` : ''}
              </div>
              {type === 'ipfs' && (
                <div className='mb-2'>
                  <Progress color='primary' size='sm' value={sizePercent} />
                </div>
              )}

              <div>
                <Button
                  size='sm'
                  bordered
                  auto
                  className='w-full'
                  onClick={() => toExpansion?.()}>
                  {t('pages.space.data.btn_expansion')}
                </Button>
              </div>
            </div>
            <div className=''>
              <div className='mb-2 text-3'>
                {t('common.file')}：{summary.usedItem}
                {type === 'dkvs' ? `/${summary.total}(${numPercent}%)` : ''}
              </div>
              {type === 'dkvs' && (
                <div className='mb-2'>
                  <Progress color='primary' size='sm' value={numPercent} />
                </div>
              )}

              <div className='flex'>
                <Button
                  size='sm'
                  className='w-full'
                  auto
                  onPress={() => toDetail?.()}>
                  {t('pages.space.data.btn_detail')}
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
