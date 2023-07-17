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
import { useGunStore, GunSummy } from '@/store';


export default function GunRenew() {
  const nav = useNavigate();
  const gunnameRef = useRef('');
  const [gunname, setGunname] = useState('');
  const [changeDisabled , setApplyDisable] = useState(false);
  const VALID_MONTH = 0;
  const VALID_YEAR = 1;
  const VALID_2YEAR = 2;

  const [selectedValid, setSelectedValid] = useState(VALID_YEAR);
  const { name } = useParams<{ name: string }>(); // 获取路由参数中的 gunname
  //const { mutate: modifyuser, loading: modifyLoading };
  const renewGUN = useGunStore((state) => state.renew);
  const loadGUN = useGunStore((state) => state.load);

  const [nameValid, setnameValid] = useState("gunvalid");


  const RenewGun = async () => {
    console.log("RenewGun...");
    const result = await renewGUN(gunname, selectedValid);
    console.log("ApplyGun return = ", result);
    if (result == true) {
      console.log("will nav to GUN list page");
      // Apply success, we should reload GUN list 
      await loadGUN();
      //nav(`/gun/get/${name}`);

      // return prev page
      nav(-1); 

    }
  };

  useEffect(() => {
    
    // 获取传入的参数
    const gunname : string = name ? name : ""; 
    setGunname(gunname)
    
  }, []);


    return (
    <LayoutThird showBack title='给你的GUN域名续期'>
      <div>
        <div className='pt-4 px-4'>
          <Text className='text-14px mb-6'>
              你可以给你的GUN域名进行续期， 续期时长包括一个月， 一年和二年， 续期成功后会在你原来的有效期基础上延长你申请的续期时长。
          </Text>
        </div>
        <div className='px-4'>
        <Text className='text-3 mb-4'>
              {gunname}
            </Text>
        </div>
        <div className='pt-1 px-4'>
          <div className='pt-1'>
            <Text className='text-3 mb-2'>
              选择你要申请的GUN的续期时长， 可选择一月，一年或二年。
            </Text>
          </div>
          <div className='pt-1'>
            <label className='text-3 mb-4 px-4'>
              <input type="radio" name="gender" checked={selectedValid === VALID_MONTH} onChange={() => setSelectedValid(VALID_MONTH)} /> 一个月
            </label>
            <label className='text-3 mb-4  px-4'>
              <input type="radio" name="gender" checked={selectedValid === VALID_YEAR} onChange={() => setSelectedValid(VALID_YEAR)} /> 一年
            </label>
            <label className='text-3 mb-4  px-4'>
              <input type="radio" name="gender" checked={selectedValid === VALID_2YEAR} onChange={() => setSelectedValid(VALID_2YEAR)} /> 二年
            </label>
          </div>
        </div>
        <div className='pt-4 px-4'>
          <div>
            <Button
              disabled={changeDisabled}
              //loading={modifyLoading}
              className='mx-auto mb-2 w-full'
              size='lg'
              onPress={RenewGun}>
              续期
            </Button>
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}


