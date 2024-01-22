import LayoutThird from "@/layout/LayoutThird";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WalletNetItem } from "../components/WalletNetItem"; 
import IconBtc from "@/assets/images/wallet/icon-btc.png";
import IconEth from "@/assets/images/wallet/icon-eth.png";
import { ROUTE_PATH } from "@/router";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function SelectNet() {
    const { t } = useTranslation();
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    

     // 定义默认的 walletNet 数据
     const defaultWalletNets = {
      btc: "BTC",
      eth: "ETH",
    };

  // 使用 useState 定义存储 walletNet 数据的状态
  const [walletNets, setWalletNets] = useState(defaultWalletNets);



    const toMakeWalletDetails = (walletNet: string) => {
      if (searchParams.get('walletMethod') === "create") {
        toAddWalletDetails(walletNet);
      } else if (searchParams.get('walletMethod') === "import") {
        toImportWalletDetails(walletNet);
      } else {
        toast.error(t('pages.assets.token.add_wallet_method_error'));
      }
    }

   

    const toAddWalletDetails = (net: string) => {
        nav(ROUTE_PATH.ASSETS_TOKEN_ADD_WALLET_DETAILS + '?walletNet=' + net);
      };

    const toImportWalletDetails = (net: string) => {
      nav(ROUTE_PATH.ASSETS_TOKEN_IMPORT_WALLET_DETAILS + '?walletNet=' + net);
    };

    return (
        <LayoutThird className='h-full' title={t('pages.assets.token.select_net')}> 
         <div className='p-4'>
          <div className='mb-5'>
                  <WalletNetItem
                    icon={IconBtc}
                    symbol={defaultWalletNets.btc}
                    chain="Bitcoin"
                    key='point'
                    onClick={() => toMakeWalletDetails(defaultWalletNets.btc)}
                  />
          </div>
          <div className='mb-20'>
                  <WalletNetItem
                    icon={IconEth}
                    symbol={defaultWalletNets.eth}
                    chain="Ethereum"
                    key='point'
                    onClick={() => toMakeWalletDetails(defaultWalletNets.eth)}
                  />
          </div>
        </div>
        </LayoutThird> 
    );
}