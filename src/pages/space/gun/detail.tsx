import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { ROUTE_PATH } from '@/router';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { useAccountStore, GunSummy } from '@/store';
import { format } from 'date-fns';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function detailPage() {
  const nav = useNavigate();
  const { t } = useTranslation();
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
        toast.error(t('pages.space.gun.detail_error'));
      }
      setLoading(false);
    }
  };
  const setAccountName = async () => {
    const { code, msg } = await account.updateName({ name: detail.name });
    if (code === '000000') {
      toast.success(t('common.toast.set_success'));
      setAccountInfo({ name: detail.name });
      nav(ROUTE_PATH.SPACE_INDEX);
    } else {
      toast.error(msg);
    }
  };
  const isOwner = useMemo(() => {
    return detail?.owner === accountInfo?.address;
  }, [detail.owner, accountInfo.address]);
  const addOwner = async () => {
    if (detail?.owner) {
      const { code, msg, data } = await account.createContactByWalletKey(
        detail?.owner,
      );
      if (code === '000000') {
        toast.success(t('pages.chat.search_success'));
      } else {
        toast.error(msg || t('pages.chat.search_error'));
      }
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <LayoutThird showBack title={t('pages.space.gun.detail_title')}>
      <div>
        <div className='pt-4 px-4 text-16px mb-2 break-all'>
        {t('pages.space.gun.detail_name')}： {detail?.name}
        </div>
        <div className='pt-1 px-4 text-16px mb-2 break-all'>
        {t('pages.space.gun.detail_key')}： {detail?.key}
        </div>
        {detail.expired && (
          <div className='pt-1 px-4 text-16px mb-2 break-all'>
             {t('pages.space.gun.expired_text')}：{format(detail.expired, 'yyyy-MM-dd')}
          </div>
        )}

        <div className='pt-1 px-4 text-16px mb-2 break-all'>
          {t('pages.space.gun.owner')}： {detail?.owner}
        </div>
        {!loading && (
          <div className='pt-1 px-4'>
            <div>
              {isOwner ? (
                <>
                  <Button
                    disabled={changeDisabled || true}
                    //loading={modifyLoading}
                    className='mx-auto mb-2 w-full'
                    size='lg'
                    onPress={ApplyNewValidPeriod}>
                    {t('pages.space.gun.renew')}
                  </Button>
                  <Button
                    disabled={changeDisabled}
                    //loading={modifyLoading}
                    className='mx-auto mb-2 w-full'
                    size='lg'
                    onPress={setAccountName}>
                    {t('pages.space.gun.set_name')}
                  </Button>
                </>
              ) : (
                <Button
                  disabled={changeDisabled}
                  //loading={modifyLoading}
                  className='mx-auto mb-2 w-full'
                  size='lg'
                  onPress={addOwner}>
                 {t('pages.space.gun.add_frient')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutThird>
  );
}
