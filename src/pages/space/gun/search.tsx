import { useState, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useGunStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function GunSearch() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [changeDisabled, setSearchDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  // const { name } = useParams<{ name: string }>(); // 获取路由参数中的 gunname
  // const [gunname, setGunname] = useState(name);
  const timer = useRef<any>(null);
  const {
    apply: applyGUN,
    load: loadGUN,
    searchName,
    setName,
  } = useGunStore((state) => state);

  const SearchGun = async () => {
    console.log('SearchGun...');
    if (searchName) {
      setLoading(true);
      const { code, data, msg } = await account.getGun({
        GunName: searchName,
      });
      if (code === '000000') {
        nav(`/space/gun/detail/${data.Gun_Name}`);
      } else {
        toast.error(msg);
      }
      setLoading(false);
    }
  };

  const gunnameChange = (e: any) => {
    setName(e);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      const text = e.trim().replace(/[^A-Za-z0-9_]/g, '');
      setName(text);
    }, 100);
  };
  // const gunnameChange = (e: any) => {
  //   setGunname(e);
  // };

  const disabled = useMemo(() => {
    if (searchName) {
      return searchName.length < 8;
    } else {
      return true;
    }
  }, [searchName]);
  // useEffect(() => {

  //   let gunname : string = name ? name : "";
  //   if (gunname == "*") {
  //     gunname = "";
  //   }
  //   console.log("SearchGun useEffect param is ", gunname);
  //   setGunname(gunname);
  // }, []);

  return (
    <LayoutThird showBack title={t('pages.space.gun.search_title')}>
      <div className='p-4'>
        <div className='text-14px mb-2'>
          {t('pages.space.gun.search_hint')}
        </div>

        <div className='pt-1 mb-2'>
          <Input
            id='gunnameInput'
            clearable
            bordered
            fullWidth
            maxLength={64}
            value={searchName}
            onChange={gunnameChange}
            placeholder={t('pages.space.gun.search_input')}
          />
        </div>
        <div className='mb-4'>
          <div className='text-3 text-gray-400'>
            {t('pages.space.gun.rule_text')}
          </div>
        </div>
        <Button
          disabled={disabled}
          loading={loading}
          className='mx-auto mb-2 w-full'
          size='lg'
          onPress={SearchGun}>
           {t('pages.space.gun.search')}
        </Button>
      </div>
    </LayoutThird>
  );
}
