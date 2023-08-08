import { useState, useRef, useMemo } from 'react';
import { Text } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';

export default function GunSearch() {
  const nav = useNavigate();
  const [changeDisabled, setSearchDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const { name } = useParams<{ name: string }>(); // 获取路由参数中的 gunname
  const [gunname, setGunname] = useState(name);
  const timer = useRef<any>(null);

  const SearchGun = async () => {
    console.log('SearchGun...');
    if (gunname) {
      setLoading(true);
      const { code, data, msg } = await account.getGun({
        GunName: gunname,
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
    setGunname(e);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      const text = e.trim().replace(/[^A-Za-z0-9_]/g, '');
      setGunname(text);
    }, 100);
  };
  // const gunnameChange = (e: any) => {
  //   setGunname(e);
  // };

  const disabled = useMemo(() => {
    if (gunname) {
      return gunname.length < 8;
    } else {
      return true;
    }
  }, [gunname]);
  // useEffect(() => {

  //   let gunname : string = name ? name : "";
  //   if (gunname == "*") {
  //     gunname = "";
  //   }
  //   console.log("SearchGun useEffect param is ", gunname);
  //   setGunname(gunname);
  // }, []);

  return (
    <LayoutThird showBack title='查询GUN域名'>
      <div className='p-4'>
        <Text className='text-14px mb-2'>
          用户的全球唯一名称（Global Unique
          Name，GUN），可用于任何地方。例如，朋友可以通过名字找到你，这个名字也会在其他支持GUN协议的APP上显示等。
        </Text>

        <div className='pt-1 mb-2'>
          <Input
            id='gunnameInput'
            clearable
            bordered
            fullWidth
            maxLength={64}
            value={gunname}
            onChange={gunnameChange}
            placeholder='输入你要查询的GUN名字'
          />
        </div>
        <div className='mb-4'>
          <Text className='text-3 text-gray-400'>
            名字不区分大小写，只能使用字母a-z和数字0-9，最少8位。
          </Text>
        </div>
        <Button
          disabled={disabled}
          loading={loading}
          className='mx-auto mb-2 w-full'
          size='lg'
          onPress={SearchGun}>
          查询
        </Button>
      </div>
    </LayoutThird>
  );
}
