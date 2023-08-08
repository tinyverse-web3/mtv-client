import { useEffect, useState, useMemo } from 'react';
import { Card } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate, useSearchParams } from 'react-router-dom';
import account from '@/lib/account/account';
import { calcSize } from '@/lib/utils';

export default function NetworkDetail() {
  const [params] = useSearchParams();
  const type = params.get('type');
  const id = params.get('id');
  const [detail, setDetail] = useState<any>({});
  const getDetail = async () => {
    if (type && id) {
      const { data, code } = await account.getDataDetail({
        DataType: type,
        Key: decodeURIComponent(id),
      });
      if (code === '000000') {
        setDetail(data);
      }
    }
  };
  const sizeText = useMemo(() => {
    if (detail.Size) {
      return calcSize(detail.Size);
    }
    return 0;
  }, [detail.Size]);
  useEffect(() => {
    getDetail();
  }, [type, id]);
  return (
    <LayoutThird>
      <div className='p-4'>
        <div className='mb-4'>
          <div className='mb-2'>名称</div>
          <Card>
            <Card.Body>
              <div className='flex'>
                <div className='text-2'>{detail.Name}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className='mb-4'>
          <div className='mb-2'>CID</div>
          <Card>
            <Card.Body>
              <div className='flex'>
                <div className='text-2'>{detail.Cid}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className='mb-4'>
          <div className='mb-2'>拥有者</div>
          <Card>
            <Card.Body>
              <div className='flex'>
                <div className='text-2'>{detail.Owner}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className='mb-4'>
          <div className='mb-2'>大小</div>
          <Card>
            <Card.Body>
              <div className='flex'>
                <div className='text-2'>{sizeText}</div>
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
