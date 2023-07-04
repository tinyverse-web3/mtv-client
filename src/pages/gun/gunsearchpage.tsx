import { useState, useEffect, useRef } from 'react';
import { Text } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import {useGunList} from './gundata';
import {GunRequest} from './gunrequest';


export default function GunSearch() {
  const nav = useNavigate();
  const gunnameRef = useRef('');
  const [gunname, setGunname] = useState('');
  const [changeDisabled , setSearchDisable] = useState(true);
  const { name } = useParams<{ name: string }>(); // 获取路由参数中的 gunname

  const [nameValid, setnameValid] = useState("guninvalid");

  const SearchGun = async () => {
    console.log("SearchGun...");
    const gunrequest = new GunRequest();

    const GunName = gunnameRef.current;
    try {
      const res = await gunrequest.getGun({
        GunName,
      });

      console.log(JSON.stringify(res.data));
      const result = JSON.stringify(res.data.data.gundetails);
      const gundetailsContent = JSON.parse(result);
      nav(`/gun/get/${gundetailsContent.Gun_Name}`);
      //return gundetailsContent.Gun_Key;
    } catch (error) {
      console.log(" Get Gun Details Error : ", error);
      toast('你查找的GUN域名还没有人使用！！');
      //return "";
    }
  };

  const gunnameChange = (e: any) => {
    gunnameRef.current = e;
    setGunname(e);
  
    console.log("current gunname is ", e);

    // check the gun name include invalid character;
    const text = e.replace(/[^A-Za-z0-9_]/g, '')
    if (text != e) {
        // gun name include invalid character
        if (nameValid == "gunvalid") {
          // current status is valid, set to invalid
          setnameValid("guninvalid");
          setSearchDisable(true)
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
        setSearchDisable(false)
        var input = document.getElementById("gunnameInput");
        if (input) {
          input.style.color = '#545454';
        }
      }
    }
  };




  useEffect(() => {
    
    let gunname : string = name ? name : ""; 
    if (gunname == "*") {
      gunname = "";
    }
    console.log("SearchGun useEffect param is ", gunname);
    setGunname(gunname);
    /*
    console.log("gun name changed in useEffect ...");
    if (nameValid == "gunvalid") {
        setSearchDisable(false)
    }
    else {
        setSearchDisable(true)
    }
    */
  }, []);

    return (
    <LayoutThird showBack title='查询GUN域名'>
      <div>

        <div className='pt-4 px-4'>
          <Text className='text-14px mb-2'>
            用户的全球唯一名称（Global Unique Name，GUN），可用于任何地方。例如，朋友可以通过名字找到你，这个名字也会在其他支持GUN协议的APP上显示等。
          </Text>
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
            placeholder='输入你要查询的GUN名字'
            />
        </div>

        <div className='pt-4 px-4'>
          <div>
            <Button
              disabled={changeDisabled}
              //loading={modifyLoading}
              className='mx-auto mb-2 w-full'
              size='lg'
              onPress={SearchGun}>
              查询
            </Button>
          </div>
        </div>

      </div>
    </LayoutThird>
  );
}


