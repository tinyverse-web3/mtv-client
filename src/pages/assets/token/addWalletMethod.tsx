import LayoutThird from "@/layout/LayoutThird";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddWalletItem } from "../components/AddWalletItem"; 
import IconCreate from "@/assets/images/wallet/icon-create.png";
import IconImport from "@/assets/images/wallet/icon-import.png";
import { ROUTE_PATH } from "@/router";

export default function AddWalletMethod() {
    const { t } = useTranslation();
    const nav = useNavigate();


    const toSelectWalletNet = (method: string) => {
      nav(ROUTE_PATH.ASSETS_TOKEN_SELECT_WALLET_NET + '?walletMethod=' + method);
    };

    return (  
        <LayoutThird className='h-full' title={t('pages.assets.token.add_wallet')}> 
         <div className='p-4'>
          <div className='mb-5'>
                  <AddWalletItem
                    icon={IconCreate}
                    symbol={t('pages.assets.token.create_wallet')}
                    chain={t('pages.assets.token.create_wallet_chain')}
                    key='point'
                    onClick={() => toSelectWalletNet("create")}
                  />
          </div>
          <div className='mb-20'>
                  <AddWalletItem
                    icon={IconImport}
                    symbol={t('pages.assets.token.import_wallet')}
                    chain={t('pages.assets.token.import_wallet_chain')}
                    key='point'
                    onClick={() => toSelectWalletNet("import")}
                  />
          </div>
        </div>
        </LayoutThird> 
    );
}