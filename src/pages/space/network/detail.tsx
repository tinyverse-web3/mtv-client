import { useEffect, useState, useMemo } from 'react';
import { Card } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate, useSearchParams } from 'react-router-dom';
import account from '@/lib/account/account';
import { calcSize } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function NetworkDetail() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const type = params.get('type');
  const id = params.get('id');
  const cid = params.get('cid');
  const [detail, setDetail] = useState<any>({});
  const getDetail = async () => {
    if (type && id) {
      const { data, code } = await account.getDataDetail({
        DataType: type,
        Key: decodeURIComponent(id),
        Cid: cid ? decodeURIComponent(cid) : undefined,
      });
      if (code === '000000') {
        setDetail(data || {});
      }
    }
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
    if (detail.Size) {
      return calcSize(detail.Size);
    }
    return 0;
  }, [detail.Size]);
  useEffect(() => {
    getDetail();
  }, [type, id]);
  return (
    <LayoutThird title={t('pages.space.data.title')}>
      <div className='p-4'>
        <div className='mb-4'>
          <div className='mb-2'>Key</div>
          <Card variant='bordered'>
            <Card.Body>
              <div className='flex'>
                <div className=''>{detail.Key}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
        {!!detail.Cid && (
          <div className='mb-4'>
            <div className='mb-2'>{t('pages.space.data.cid')}</div>
            <Card variant='bordered'>
              <Card.Body>
                <div className='flex'>
                  <div className=''>{detail.Cid}</div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {detail.PinStatus !== null &&
          detail.PinStatus !== undefined &&
          type === 'ipfs' && (
            <div className='mb-4'>
              <div className='mb-2'>{t('pages.space.data.status.title')}</div>
              <Card variant='bordered'>
                <Card.Body>
                  <div className='flex'>
                    <div
                      className=''
                      style={{ color: statusColorMap[detail.PinStatus] }}>
                      {pinStatusMap[detail.PinStatus]}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        {!!detail.Size && (
          <div className='mb-4'>
            <div className='mb-2'>{t('pages.space.data.size_text')}</div>
            <Card variant='bordered'>
              <Card.Body>
                <div className='flex'>
                  <div className=''>{sizeText}</div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {!!detail.Description && (
          <div className='mb-4'>
            <div className='mb-2'>{t('common.description')}</div>
            <Card variant='bordered'>
              <Card.Body>
                <div className='flex'>
                  <div className=''>{detail.Description}</div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* <div className='mb-4'>
          <div className='mb-2'>{t('pages.space.redundancy_text')}</div>
          <Card variant='bordered'>
            <Card.Body>
              <div className='flex justify-between'>
                <div className=''>156.251.179.110</div>
                <div className='i-mdi-chevron-down-circle-outline'></div>
              </div>
            </Card.Body>
          </Card>
        </div> */}
        {/* <div className='mb-4'>
          <div className='mb-2'>内容</div>
          <Card variant="bordered" >
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
        </div> */}
      </div>
    </LayoutThird>
  );
}
