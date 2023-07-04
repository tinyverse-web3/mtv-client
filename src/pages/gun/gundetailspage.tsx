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
import {useGunList, GunSummy} from './gundata';
import { format } from 'date-fns';
import {GunRequest} from './gunrequest';


export default function GunDetailsPage() {
  const nav = useNavigate();
  const gunnameRef = useRef('');
  const [changeDisabled , setApplyDisable] = useState(false);
  const getDetails = useGunList((state) => state.get);
  
  const { name } = useParams<{ name: string }>(); // 获取路由参数中的 gunname
  const [gundetails, setDetailData] = useState<GunSummy | null>(null);

  const ApplyNewValidPeriod = async () => {
    console.log("ApplyNewValidPeriod...");
    nav(`/gun/renew/${name}`)
  };

  const getGUNDetails = async () => {
    console.log("Get GUN Details...");
    const gunname : string = name ? name : ""; 

    const summy = await getDetails(gunname);

    console.log("summy from getDetails:", summy);
    if (summy == null) {
      // The GUN is not user, request from internet
       const summy = await requestGunDetails(gunname);
    }

    console.log("GUN name:", summy?summy.key:"");
    console.log("GUN key:", summy?summy.key:"");
    console.log("GUN expired:", summy?summy.expired:0);
    console.log("GUN expired format:", format(summy?summy.expired:0, 'yyyy-MM-dd'));
    console.log("GUN owner:", summy?summy.owner:0);
    setDetailData(summy?summy:null);

  }

  const requestGunDetails = async(GunName:string) => {
    const gunrequest = new GunRequest();
    try {
      const res = await gunrequest.getGun({
        GunName,
      });

      console.log(JSON.stringify(res.data));
      const result = JSON.stringify(res.data.data.gundetails);
      const gundetailsContent = JSON.parse(result);
      //nav(`/gun/get/${gundetailsContent.Gun_Name}`);
      const summy : GunSummy = {
        key: gundetailsContent.Gun_Name,
        name: gundetailsContent.Gun_Key,
        expired: gundetailsContent.ValidTime,
        owner: gundetailsContent.OwnerID,
      };

      console.log("request GUN name:", summy.key);
      console.log("request GUN key:", summy.key);
      console.log("request GUN expired:", summy.expired);
      console.log("request GUN expired format:", format(summy.expired, 'yyyy-MM-dd'));
      console.log("request GUN owner:", summy.owner);
      return summy;
      //return gundetailsContent.Gun_Key;
    } catch (error) {
      console.log(" Get Gun Details Error : ", error);
      //return "";
    }
  }
  

  useEffect(() => {
      getGUNDetails()
  }, []);


    return (
    <LayoutThird showBack title='查看GUN域名信息'>
      <div>
      <div className='pt-4 px-4 text-16px mb-2 break-all'>
            GUN名称： {gundetails?.name}
        </div>
        <div className='pt-1 px-4 text-16px mb-2 break-all'>
            Key： {gundetails?.key}
        </div>
        
        <div className='pt-1 px-4 text-16px mb-2 break-all'>
            过期时间：{format(gundetails?gundetails.expired:0, 'yyyy-MM-dd')}
        </div>

        <div className='pt-1 px-4 text-16px mb-2 break-all'>
                    拥有者： {gundetails?.owner}
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
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}


