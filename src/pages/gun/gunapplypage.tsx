import { useState, useEffect, useRef } from 'react';
import { Text } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { useRequest } from '@/api';
import {useGunList} from './gundata';
import Dialog from './dialog';


export default function GunRenew() {
  const nav = useNavigate();
  const gunnameRef = useRef('');
  const [gunname, setGunname] = useState('');
  const [changeDisabled , setApplyDisable] = useState(true);
  const VALID_MONTH = 0;
  const VALID_YEAR = 1;
  const VALID_2YEAR = 2;

  const [selectedValid, setSelectedValid] = useState(VALID_YEAR);
  //const { mutate: modifyuser, loading: modifyLoading };
  const applyGUN = useGunList((state) => state.apply);
  const loadGUN = useGunList((state) => state.load);

  const [nameValid, setnameValid] = useState("gunvalid");

  //const changeDisabled ;
  /*= useMemo(() => {
    console.log("changeDisabled.");
    return gunname.length < 12 || nameValid == "gunvalid";
  }, [gunname, nameValid]);
*/

  const ApplyGun = async () => {
    console.log("ApplyGun...");
    const name = await applyGUN(gunname, selectedValid);
    console.log("ApplyGun return = ", name);
    if (name.length > 0) {
      console.log("will nav to GUN list page");
      toast("申请成功了", { duration: 2000 });
      // Apply success, we should reload GUN list 
      await loadGUN();
      // wait reload complete and shou de details
      nav(ROUTE_PATH.GUN_GUNLISTPAGE);
      /*
      Dialog({
        Title: "申请成功了",
        content: "飞了",
        confirm: "显示详情页",
        onConfirm: onConfirm,
        cancel: "回去吧",
        onCancel: onClose
      });
      */
    }
  };

  const onConfirm = async () => {
    nav(`/gun/get/${gunname}`);
  }
  const onClose = async () => {
    nav(-1);
  }

  
  const CheckGun = async () => {
    console.log("CheckGun...");
    // Check the gun name is used or not 
   
    let name:string = gunname;
    if (name.length == 0)
    {
      name = "*"
    }

    console.log("name = ", name);
    nav(`/gun/search/${name}`);
    //nav(`/gun/gunsearchpage`);
  };

  const gunnameChange = (e: any) => {
    gunnameRef.current = e;
    setGunname(e);
  
    // check the gun name include invalid character;
    const text = e.replace(/[^A-Za-z0-9_]/g, '')
    if (text != e) {
        // gun name include invalid character
        if (nameValid == "gunvalid") {
          // current status is valid, set to invalid
          setnameValid("guninvalid");
          var input = document.getElementById("gunnameInput");
          if (input) {
            input.style.color = '#EE3D11';
          }
        }
    }
    else {
      // gun name not include invalid character
      if (nameValid == "guninvalid") {
        // current status is invalid, set to valid
        setnameValid("gunvalid");
        var input = document.getElementById("gunnameInput");
        if (input) {
          input.style.color = '#545454';
        }
      }
    }
  };


  useEffect(() => {
    
    console.log("gun name changed in useEffect ...");
    if (gunname.length >= 12 && nameValid == "gunvalid") {
      setApplyDisable(false)
    }
    else {
      setApplyDisable(true)
    }
    
  }, [gunname]);

  const style = { color:"#3282F6"};
  const label = "";

    return (
    <LayoutThird showBack title='申请你的GUN域名' path={ROUTE_PATH.GUN_GUNLISTPAGE}>
      <div>
        <div className='pt-4 px-4'>
          <Text className='text-14px mb-2'>
            用户的全球唯一名称（Global Unique Name，GUN），可用于任何地方。例如，朋友可以通过名字找到你，这个名字也会在其他支持GUN协议的APP上显示等。
          </Text>
        </div>
        <div className='flex justify-between h-2 mb-1' >
            <span>{label}</span>
            <div className='flex items-center'>
              <div className='text-3 mr-4' style = {style}> 
                <a onClick={CheckGun}>查看GUN是否已经被申请</a>
              </div>
            </div>
        </div>
        <div className='px-4 pt-1'>
          <Input 
            id = "gunnameInput"
            clearable
            bordered
            fullWidth
            maxLength={64}
            value={gunname}
            onChange={gunnameChange}
            placeholder='输入你要申请的GUN名字'
            />
        </div>
        <div className='pt-1 px-4'>
            <Text className='text-3 mb-4'>
              你可以免费申请一个大于12个字符的名字，目前只支持字母、数字和连接符_，且不区分字母大小。
            </Text>
          </div>
        <div className='pt-1 px-4'>
          <div className='pt-1'>
            <Text className='text-3 mb-2'>
              选择你要申请的GUN的有效期， 可选择一月，一年或二年。
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
              onPress={ApplyGun}>
              申请
            </Button>
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}


