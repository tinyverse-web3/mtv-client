import { useMemo } from 'react';
import { Image } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

interface AssetsNftItemProps {
  item: {
    Cid: string;
    Data: string;
    DataType: string;
    Description: string;
    Name: string;
    Nftname: string;
    Owner: string;
  };
}
const NftItem = ({ item }: AssetsNftItemProps) => {
  if (item.DataType === 'image/png') {
    return <AssetsNftItem item={item} />;
  }
};
export const AssetsNftItem = ({ item }: AssetsNftItemProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const url = useMemo(() => {
    return `${apiHost}/sdk/nft/getPicture?Cid=${item.Cid}`;
  }, [item.Cid]);

  const toDetail = () => {
    nav(`${ROUTE_PATH.ASSETS_NFT_DETAIL}?id=${item.Nftname}`);
  };
  return (
    <div
      className='flex items-center p-2 px-4 cursor-pointer rounded-4 bg-gray-1 mb-2'
      key={item.Nftname}
      onClick={toDetail}>
      {item.DataType.indexOf('image') > -1 && (
        <div className=' w-10 h-10 mr-6'>
          <Image src={url} className='w-full h-full' />
        </div>
      )}

      <div className='flex-1'>
        <div className='break-all'>
          {item.DataType === 'GUN' && (
            <span className='text-blue-5'>
              【{t('pages.space.gun.title')}】
            </span>
          )}
          <span>{item.Name}</span>
        </div>
        {/* <div className='flex justify-between items-center'>
          <div className='text-12px'>{item.Owner}</div>
        </div> */}
      </div>
    </div>
  );
};
