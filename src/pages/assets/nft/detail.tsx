import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/form/Button';
import { useAccountStore } from '@/store';
import { Icon } from '@iconify/react';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate, useSearchParams } from 'react-router-dom';
import account from '@/lib/account/account';
import { calcSize } from '@/lib/utils';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
export default function NftDetail() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { getLocalAccountInfo } = useAccountStore((state) => state);
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
  const setAvatar = async () => {
    if (detail.Nftname) {
      const { code, msg } = await account.setAvatar(detail.Nftname);
      if (code === '000000') {
        await getLocalAccountInfo();
        toast.success(t('common.toast.set_success'));
      } else {
        toast.error(msg);
      }
    }
  };
  const setAccountName = async () => {
    const { code, msg } = await account.updateName({ name: detail.Nftname });
    if (code === '000000') {
      await getLocalAccountInfo();
      toast.success(t('common.toast.set_success'));
    } else {
      toast.error(msg);
    }
  };
  const setProfile = async () => {
    if (imageType) {
      await setAvatar();
    } else if (gunType) {
      await setAccountName();
    }
  };
  const imageType = useMemo(() => {
    return detail.DataType?.indexOf('image') > -1;
  }, [detail.DataType]);
  const gunType = useMemo(() => {
    return detail.DataType?.indexOf('GUN') > -1;
  }, [detail.DataType]);

  const showSetButton = useMemo(() => {
    return imageType || gunType;
  }, [imageType, gunType]);
  const url = useMemo(() => {
    return `${apiHost}/sdk/nft/getPicture?Cid=${detail.Cid}`;
  }, [detail.Cid]);
  useEffect(() => {
    getDetail();
  }, [id]);
  return (
    <LayoutThird title={t('pages.assets.nft.detail_text')}>
      <div className='p-4'>
        <PhotoProvider>
          <div className='flex justify-center items-center mb-4'>
            <div className='p-4 bg-gray-100 rounded-full '>
              <PhotoView src={url}>
                <img
                  src={
                    detail.DataType?.indexOf('image') > -1 ? url : '/logo.png'
                  }
                  className='w-16 h-16 '
                />
              </PhotoView>
            </div>
          </div>
        </PhotoProvider>
        <div className='bg-gray-100  rounded-3xl p-2 flex  items-center justify-between mb-2'>
          <Button
            radius='full'
            className='h-12 flex-1'
            variant='outline'
            onClick={toTransfer}>
            <Icon
              icon='mdi:arrow-up-bold-circle-outline'
              className='text-2xl mr-2 '
            />
            <div className='tex'>{t('pages.assets.nft.btn_transfer')}</div>
          </Button>
          {showSetButton && (
            <Button
              radius='full'
              className='h-12 flex-1 ml-8'
              onClick={setProfile}>
              <Icon
                icon='material-symbols:settings-account-box-outline'
                className='text-2xl mr-2'
              />
              <div className='text-sm'>
                {imageType
                  ? t('pages.assets.nft.btn_set_avatar')
                  : t('pages.space.gun.set_name')}
              </div>
            </Button>
          )}
        </div>
        {!!detail.Nftname && (
          <div className='mb-4'>
            <div className='mb-2 text-blue-500'>{t('common.title')}</div>

            <div className='flex p-2 rounded-xl bg-gray-100 text-sm'>
              <div className='break-all'>{detail.Nftname}</div>
            </div>
          </div>
        )}
        {/* {!!detail.Cid && (
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
        )} */}
        {!!detail.Description && (
          <div className='mb-4'>
            <div className='mb-2 text-blue-500'>{t('common.description')}</div>
            <div className='flex p-2 rounded-xl bg-gray-100 text-sm'>
              <div className=' break-all'>{detail.Description}</div>
            </div>
          </div>
        )}
        {!!detail.Content && (
          <div className='mb-4'>
            <div className='mb-2 text-blue-500'>{t('common.content')}</div>
            <div className='p-4'>
              {!!detail.Content && (
                <div className='flex p-2 rounded-xl bg-gray-100 text-sm'>
                  <div className=' break-all'>{detail.Content}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutThird>
  );
}
