import { calcSize } from '@/lib/utils';
import { Button } from '@/components/form/Button';
import { Card, Progress } from '@nextui-org/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  title: string;
  summary: any;
  toDetail?: () => void;
  toExpansion?: () => void;
}
export function IndexItem({ title, toDetail, toExpansion, summary }: Props) {
  const { t } = useTranslation();
  const usedSize = useMemo(() => {
    if (summary.used) {
      return calcSize(summary.used);
    }
  }, [summary.used]);
  const totalSpace = useMemo(() => {
    if (summary.used) {
      return calcSize(summary.totalSpace);
    }
  }, [summary.totalSpace]);
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
  console.log(summary.usedItem / summary.total);
  return (
    <div>
      <div className='mb-2'>{title}</div>
      <Card variant='bordered'>
        <Card.Body>
          <div className=''>
            <div className='mb-4'>
              <div className='mb-4 text-3 break-keep '>
                {t('common.space')}：{usedSize}/{totalSpace}({sizePercent}%)
              </div>
              <div className='mb-4'>
                <Progress color='primary' size='md' value={sizePercent} />
              </div>
              <div>
                <Button
                  size='md'
                  bordered
                  auto
                  className='w-full'
                  onClick={() => toExpansion?.()}>
                  {t('pages.space.data.btn_expansion')}
                </Button>
              </div>
            </div>
            <div className=''>
              <div className='mb-4 text-3'>
                {t('common.file')}：{summary.usedItem}/{summary.total}(
                {numPercent}%)
              </div>
              <div className='mb-4'>
                <Progress color='primary' size='md' value={numPercent} />
              </div>
              <div className='flex'>
                <Button
                  size='md'
                  className='w-full'
                  auto
                  onClick={() => toDetail?.()}>
                  {t('pages.space.data.btn_detail')}
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
