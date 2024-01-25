import LayoutThird from "@/layout/LayoutThird";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AddWalletItem } from "../components/AddWalletItem"; 
import IconCreate from "@/assets/images/wallet/icon-create.png";
import IconImport from "@/assets/images/wallet/icon-import.png";
import { ROUTE_PATH } from "@/router";
import { useEffect, useState } from "react";
import account from '@/lib/account/account';
import { AddressTypeItem } from "../components/AddressTypeItem";
import { hideStr } from "@/lib/utils";


interface ListItem {
  type: string;
  address: string;
  isDefault: boolean;
}


export default function SwitchAddressType() {
    const { t } = useTranslation();
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const walletName = searchParams.get('walletName') as string;
    const [list, setList] = useState<ListItem[]>([]);

    
    const getAddressList = async () => {
      const result = await account.getBtcAddressType(walletName);
      setList(result);
    }

    const toDetails = () => {
      //Todo
      //setDefaultAddress()
      //通过接口设置成功后再调用下面的nav
      nav(ROUTE_PATH.ASSETS_TOKEN_WALLET_DETAILS + `?name=${walletName}`);
    };

    useEffect(() => {
      getAddressList();
    }, []);

   

    return (  
        <LayoutThird className='h-full' title={t('pages.assets.token.wallet_select_addr_type')}> 
          <div className='p-4'>
         {list.map((item) => (
                  <AddressTypeItem
                    type={item.type}
                    address={hideStr(item.address, 4)}
                    isDefault={item.isDefault}
                    onClick={() => toDetails()}
                  />
                ))}
        </div>
        </LayoutThird> 
    );
}