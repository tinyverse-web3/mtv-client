import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/form/Button';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
} from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate, useSearchParams } from 'react-router-dom';
import account from '@/lib/account/account';
import { calcSize } from '@/lib/utils';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

export default function NftDetail() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const [params] = useSearchParams();
  const id = params.get('id');
  const [detail, setDetail] = useState<any>({});
  const getDetail = async () => {
    if (id) {
      const { data, code } = await account.getNftDetail(id);
      if (code === '000000') {
        setDetail(data);
      }
    }
  };
  const toTransfer = () => {
    nav(ROUTE_PATH.ASSETS_NFT_TRANSFER + `?id=${id}`);
  };
  const sizeText = useMemo(() => {
    if (detail.Size) {
      return calcSize(detail.Size);
    }
    return 0;
  }, [detail.Size]);
  const url = useMemo(() => {
    return `${apiHost}/sdk/nft/getPicture?Cid=${detail.Cid}`;
  }, [detail.Cid]);
  useEffect(() => {
    getDetail();
  }, [id]);
  return (
    <LayoutThird title={t('pages.assets.nft.detail_text')}>
      <div className='p-4'>
        <div className='mb-4'>
          <div className='mb-2'>{t('pages.assets.nft.detail_name')}</div>
          <Card>
            <CardBody>
              <div className='flex'>
                <div className=' break-all'>{detail.Nftname}</div>
              </div>
            </CardBody>
          </Card>
        </div>
        {!!detail.Cid && (
          <div className='mb-4'>
            <div className='mb-2'>CID</div>
            <Card>
              <CardBody>
                <div className='flex'>
                  <div className='break-all'>{detail.Cid}</div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
        {!!detail.Owner && (
          <div className='mb-4'>
            <div className='mb-2'>{t('pages.assets.owner')}</div>
            <Card>
              <CardBody>
                <div className='flex'>
                  <div className='break-all'>{detail.Owner}</div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
        {!!detail.Description && (
          <div className='mb-4'>
            <div className='mb-2'>{t('common.description')}</div>
            <Card>
              <CardBody>
                <div className='flex'>
                  <div className=' break-all'>{detail.Description}</div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
        {!!detail.DataType && (
          <div className='mb-4'>
            <div className='mb-2'>{t('common.content')}</div>
            <div className='p-4'>
              {detail.DataType?.indexOf('image') > -1 && (
                <PhotoProvider>
                  <div className='w-full'>
                    <PhotoView src={url}>
                      <Image src={url} className='w-full' />
                    </PhotoView>
                  </div>
                </PhotoProvider>
              )}
              {!!detail.Content && (
                <Card>
                  <CardBody>
                    <div className='flex'>
                      <div className=' break-all'>{detail.Content}</div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        )}
        <Button className='w-full' onClick={toTransfer}>
          {t('pages.assets.nft.btn_transfer')}
        </Button>
      </div>
    </LayoutThird>
  );
}
