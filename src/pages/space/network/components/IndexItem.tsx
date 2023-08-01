import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Progress } from '@nextui-org/react';

interface Props {
  title: string;
  toDetail?: () => void;
  toExpansion?: () => void;
}
export function IndexItem({ title, toDetail, toExpansion }: Props) {
  return (
    <div>
      <div className='mb-2'>{title}</div>
      <Card>
        <Card.Body>
          <div className='flex'>
            <div className='flex-1'>
              <div className='mb-4'>空间：0.5M/1M</div>
              <div className='mb-4'>
                <Progress color='primary' size='md' value={72} />
              </div>
              <div>
                <Button
                  size='md'
                  bordered
                  auto
                  className='w-full'
                  onClick={() => toExpansion?.()}>
                  扩容
                </Button>
              </div>
            </div>
            <div className='flex-1 ml-6'>
              <div className='mb-4'>文件：19/20</div>
              <div className='mb-4'>
                <Progress color='primary' size='md' value={72} />
              </div>
              <div className='flex'>
                <Button
                  size='md'
                  className='w-full'
                  auto
                  onClick={() => toDetail?.()}>
                  详情
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
