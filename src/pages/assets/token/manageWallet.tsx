import LayoutThird from "@/layout/LayoutThird";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddWalletItem } from "../components/AddWalletItem"; 
import IconBtc from "@/assets/images/wallet/icon-btc.png";
import IconEth from "@/assets/images/wallet/icon-eth.png";
import { ROUTE_PATH } from "@/router";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/store";
import { ManageWalletItem } from "../components/ManageWalletItem";
import toast from "react-hot-toast";
import account, { Account } from '@/lib/account/account';

export default function ManageWallet() {
    const { t } = useTranslation();
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const { list, remove, getList } = useWalletStore((state) => state);


    const getWalletList = async () => {
      if (!list?.length) {
        setLoading(true);
      }
      await getList();
      setLoading(false);
    };
    useEffect(() => {
      getWalletList();
    }, []);
  
    const getIconByType = (type: string) => {
     switch (type) {
       case 'Tinyverse':
         return '/logo.png';
       case 'Bitcoin':
         return IconBtc;
       case 'Ethereum':
         return IconEth;
     }
    }

    const deleteWallet = async (name: string, type: string) => {
      console.log('name = ' + name)
      console.log('type = ' + type)
      if (type === 'Ethereum') {
        await account.deleteEthWallet(name);
      } else if (type === 'Bitcoin') {
        await account.deleteBtcWallet(name);
      }

      toast.success(t('pages.assets.token.del_wallet_success') +  ": " + name);
      nav(ROUTE_PATH.ASSETS_INDEX);
    }
    const editWallet = (name: string) => {
      nav(ROUTE_PATH.ASSETS_TOKEN_EDIT_WALLET_NAME + '?walletName=' + name);
    }

    const toTokenDetail = (type: string) => {
      switch (type) {
        case 'Tinyverse':
          nav(ROUTE_PATH.ASSETS_TOKEN_DETAIL);
        case 'Bitcoin':
          //nav();
        case 'Ethereum':
          //nav();
      }
    }

    return (  
        <LayoutThird className='h-full' title={t('pages.assets.token.manage_wallet')}> 
         <div className='p-4'>
         {list.map((item) => (
                  <ManageWalletItem
                    icon={getIconByType(item.Type)}
                    type={item.Type}
                    key={item.Address}
                    name={item.Name}
                    address={item.Address}
                    onClick={() => toTokenDetail(item.Type)}
                    onClickDel={() => deleteWallet(item.Name, item.Type)}
                    onClickEdit={() => editWallet(item.Name)}
                  />
                ))}
        </div>
        </LayoutThird> 
    );
}