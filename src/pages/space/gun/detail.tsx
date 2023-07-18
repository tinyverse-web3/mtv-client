import { useState, useEffect, useRef } from 'react';
import { Text } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { useRequest } from '@/api';
import { useAccountStore, GunSummy } from '@/store';
import { format } from 'date-fns';
import account from '@/lib/account/account';

export default function detailPage() {
  const nav = useNavigate();
  const gunnameRef = useRef('');
  const [changeDisabled, setApplyDisable] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const { setAccountInfo } = useAccountStore((state) => state);
  const { name } = useParams<{ name: string }>(); // 获取路由参数中的 gunname

  const ApplyNewValidPeriod = async () => {
    console.log('ApplyNewValidPeriod...');
    nav(`/space/gun/renew/${name}`);
  };

  const getDetail = async () => {
    if (name) {
      const { code, msg, data } = await account.getGun({
        GunName: name,
      });
      if (code === '000000') {
        const summy: GunSummy = {
          key: data.Gun_Key,
          name: data.Gun_Name,
          expired: data.ValidTime,
          owner: data.OwnerID,
        };
        setDetail(summy);
      } else {
        toast.error(msg);
      }
    }
  };
  const setAccountName = async () => {
    const { code, msg } = await account.updateName({ name: detail.name });
    if (code === '000000') {
      toast.success('设置成功');
      setAccountInfo({ name: detail.name });
    } else {
      toast.error(msg);
    }
  };
  useEffect(() => {
    getDetail();
  }, []);

  return (
    <LayoutThird showBack title='查看GUN域名信息'>
      <div>
        <div className='pt-4 px-4 text-16px mb-2 break-all'>
          GUN名称： {detail?.name}
        </div>
        <div className='pt-1 px-4 text-16px mb-2 break-all'>
          Key： {detail?.key}
        </div>
        {detail.expired && (
          <div className='pt-1 px-4 text-16px mb-2 break-all'>
            过期时间：{format(detail.expired, 'yyyy-MM-dd')}
          </div>
        )}

        <div className='pt-1 px-4 text-16px mb-2 break-all'>
          拥有者： {detail?.owner}
        </div>

        <div className='pt-1 px-4'>
          <div>
            <Button
              disabled={changeDisabled}
              //loading={modifyLoading}
              className='mx-auto mb-2 w-full'
              size='lg'
              onPress={ApplyNewValidPeriod}>
              续期
            </Button>
            <Button
              disabled={changeDisabled}
              //loading={modifyLoading}
              className='mx-auto mb-2 w-full'
              size='lg'
              onPress={setAccountName}>
              设置为用户名
            </Button>
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}
