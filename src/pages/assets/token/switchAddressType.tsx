import LayoutThird from "@/layout/LayoutThird";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/router";
import { useEffect, useState } from "react";
import account from '@/lib/account/account';
import { AddressTypeItem } from "../components/AddressTypeItem";
import { hideStr } from "@/lib/utils";
import toast from "react-hot-toast";

interface ListItem {
  Type: string;
  Address: string;
  IsDefault: boolean;
  Path: string;
}

export default function SwitchAddressType() {
    const { t } = useTranslation();
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const walletName = searchParams.get('walletName') as string;
    const [list, setList] = useState<ListItem[]>([]);
    
    const getAddressList = async () => {
      const result = await account.getBtcAddressList(walletName);
      setList(result.data);
    }

    const toDetails = async (item: ListItem) => {
      const result = await account.setBtcDefaultAddress(walletName, item.Address)
      if (result.code !== '000000') {
        toast.error(result.msg);
        return
      }
      nav(ROUTE_PATH.ASSETS_TOKEN_WALLET_DETAILS + `?name=${walletName}` + `&type=Bitcoin`);
    };

    useEffect(() => {
      getAddressList();
    }, []);

    return (  
      <LayoutThird className='h-full' title={t('pages.assets.token.wallet_select_addr_type')}> 
        <div className='p-4'>
          {list.map((item) => (
            <AddressTypeItem
              type={item.Type + '(' + item.Path + ')'}
              address={hideStr(item.Address, 4)}
              isDefault={item.IsDefault}
              onClick={() => toDetails(item)}
            />
          ))}
        </div>
      </LayoutThird>
    );
}