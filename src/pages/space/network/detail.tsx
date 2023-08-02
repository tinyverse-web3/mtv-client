import { Card } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';

export default function NetworkDetail() {
  const detail = {
    cid: '',
  };
  return (
    <LayoutThird>
      <div className='p-4'>
        <div className='mb-4'>
          <div className='mb-2'>CID</div>
          <Card>
            <Card.Body>
              <div className='flex'>
                <div className='text-2'>{detail.cid}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className='mb-4'>
          <div className='mb-2'>冗余度</div>
          <Card>
            <Card.Body>
              <div className='flex justify-between'>
                <div className='text-2'>156.251.179.110</div>
                <div className='i-mdi-chevron-down-circle-outline'></div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className='mb-4'>
          <div className='mb-2'>内容</div>
          <Card>
            <Card.Body>
              <div className=''>
                大漠烟孤飞长剑，长河日落几度圆。
                沙场醉卧红旗裂，西风漫卷玉门关。
                桃李春风人惯见。梧桐秋雨惹相思。
                谁教竹斜难眠夜，两地沉吟一心知。
                葡萄美酒人半醺，豪饮须当三千樽。
                羌笛悠悠思杨柳，半至江南半入云。
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </LayoutThird>
  );
}
