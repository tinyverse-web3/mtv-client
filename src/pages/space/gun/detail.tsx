import { useState, useEffect, useRef, useMemo } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const { setAccountInfo, accountInfo } = useAccountStore((state) => state);
  const { name } = useParams<{ name: string }>(); // 获取路由参数中的 gunname

  const ApplyNewValidPeriod = async () => {
    console.log('ApplyNewValidPeriod...');
    nav(`/space/gun/renew/${name}`);
  };

  const getDetail = async () => {
    if (name) {
      setLoading(true);
      try {
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
      } catch (error) {
        toast.error('获取GUN信息失败');
      }
      setLoading(false);
    }
  };
  const setAccountName = async () => {
    const { code, msg } = await account.updateName({ name: detail.name });
    if (code === '000000') {
      toast.success('设置成功');
      setAccountInfo({ name: detail.name });
      nav(ROUTE_PATH.SPACE_INDEX)
    } else {
      toast.error(msg);
    }
  };
  console.log(detail?.owner);
  console.log(accountInfo?.publicKey);
  const isOwner = useMemo(() => {
    return detail?.owner === accountInfo?.publicKey;
  }, [detail.owner, accountInfo.publicKey]);
  console.log(isOwner);
  const addOwner = async () => {
    if (detail?.owner) {
      const { code, msg, data } = await account.createContact(detail?.owner);
      if (code === '000000') {
        toast.success('添加好友成功');
      } else {
        toast.error(msg || '添加好友失败');
      }
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
        {!loading && (
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
              {isOwner ? (
                <Button
                  disabled={changeDisabled}
                  //loading={modifyLoading}
                  className='mx-auto mb-2 w-full'
                  size='lg'
                  onPress={setAccountName}>
                  设置为用户名
                </Button>
              ) : (
                <Button
                  disabled={changeDisabled}
                  //loading={modifyLoading}
                  className='mx-auto mb-2 w-full'
                  size='lg'
                  onPress={addOwner}>
                  加所有者为好友
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutThird>
  );
}
