import LayoutThird from "@/layout/LayoutThird";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconBtc from "@/assets/images/wallet/icon-btc.png";
import IconEth from "@/assets/images/wallet/icon-eth.png";
import IconReceive from "@/assets/images/wallet/icon-receive.png";
import IconSend from "@/assets/images/wallet/icon-send.png";
import IconBuy from "@/assets/images/wallet/icon-buy.png";
import { useMap } from 'react-use';
import { ROUTE_PATH } from "@/router";
import { useWalletAssetsStore, useWalletStore } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { Icon } from '@iconify/react';
import WalletDrawerMenu from "../components/WalletDrawerMenu";
import { WalletHeader } from "../components/WalletHeader";
import { hideStr } from "@/lib/utils";
import { WalletOperateItem } from "../components/WalletOperateItem";
import { WalletTransferItem } from "../components/WalletTxItem";
import account from '@/lib/account/account';
import { groupBy } from 'lodash';
import { format } from 'date-fns';
import { Empty } from '@/components/Empty';
import toast from "react-hot-toast";

export interface ReceiveTxItem {
  receiver: string;
  amount: number;
}

export interface WalletTransferItem {
  amount: number;
  comment: string;
  fee: number;
  receivers: ReceiveTxItem[];
  sender: string;
  transferName: 'tvs';
  txAddr: string;
  txTime: Date | number;
  type: 0 | 1;
}

export default function WalletDetails() {
    const { t } = useTranslation();
    const nav = useNavigate();
    const [params] = useSearchParams();
    const type = params.get('type') as string;
    const [moreAddr, setMoreAddr] = useState('');
    const [walletTxList, setWalletTxList] = useState<WalletTransferItem[]>([]);

    const walletName = params.get('name') as string;
    const { getByName } = useWalletStore((state) => state);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [data, { set, setAll, remove, reset, get }] = useMap({
      Name: walletName || '',
      Address: '',
      Type: '',
      BalanceDollar: '',
      Balance: '',
      Transfer: [],
    });

    const feachDetails = async () => {
      const detail = await getByName(walletName, type);
      setAll(detail as any);
    }

    const getTxList = async () => {
      let result: any = {};
      if (type === 'Bitcoin') {
        result = await account.getBtcDefaultAddress(walletName);
        if (result.code !== '000000') {
          toast.error(result.msg);
          return
        }
        result = await account.getBtcTxList(result.data);
      } else if (type === 'Ethereum') {
        result = await account.getEthTxList(walletName);
      }

      if (result.code !== '000000') {
        toast.error(result.msg);
        return
      }

      const list = result?.data || [];
      setWalletTxList(list);
    };

    // const getTXMore = async () => {
    //   if (!moreAddr) return;
    //   const { code, data } = await account.getTXMore(moreAddr);
    //   const list = data?.txItems || [];
    //   setWalletTxList(walletTxList.concat(list));
    //   setMoreAddr(data?.more);
    // };
    
    const list = useMemo(() => {
      return groupBy(
        walletTxList.map((v) => ({ ...v, timeText: format(v.txTime, 'yyyy-MM') })),
        'timeText',
      );
    }, [walletTxList]);
    const toWalletTx = (item: any) => {
      // setWalletTx(item);
      // nav(ROUTE_PATH.ASSETS_TOKEN_WALLET_TX);
    };

    useEffect(() => {
      if (walletName) {
        feachDetails();
        getTxList();
      }
    }, [walletName]);

    const openDrawer = () => {
      setIsDrawerOpen(true);
    };
  
    const closeDrawer = () => {
      setIsDrawerOpen(false);
    };

    const toEditWalletName = () => {
      nav(ROUTE_PATH.ASSETS_TOKEN_EDIT_WALLET_NAME + '?walletName=' + data.Name);
    }

   const toSwitchAddressType = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_SWITCH_ADDRESS_TYPE + '?walletName=' + data.Name);
   }

   const toExportWallet = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_WALLET_PHRASE + '?walletName=' + data.Name + '&walletType=' + type);
   }

   const toWalletReceiver = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_WALLET_RECEIVER + '?walletName=' + data.Name + '&walletType=' + type);
   }

   const toWalletSend = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_WALLET_SEND + '?walletName=' + data.Name + '&walletType=' + type + '&address=' + data.Address); 
   }

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
   
    return (  
        <LayoutThird 
        className='h-full'
        title={walletName}
        rightContent={
          <Icon
            onClick={openDrawer}
            icon='mdi:cog-outline'
            className='text-xl'>
          </Icon>
        }
        onRefresh={getTxList}
        //onLoad={getTXMore}
        >
        <WalletDrawerMenu
          diableAddressType={type === 'Bitcoin'} 
          isOpen={isDrawerOpen} 
          onClose={closeDrawer} 
          onEditWalletName={toEditWalletName}
          onSelectAddressType={toSwitchAddressType}
          onExportWallet={toExportWallet}
        /> 
        <div className='p-4'>
          <div className='mb-5'>
            <WalletHeader
              icon={getIconByType(data.Type)}
              address={hideStr(data.Address, 4)}
              dollar={data.Balance}
              key='balance'
              //onClick={() => toSelectWalletNet("create")}
            />
          </div>
          <div className='flex mb-20 gap-3'>
            <WalletOperateItem
              icon={IconReceive}
              title={t('pages.assets.token.transfer_receive')}
              key='receive'
              onClick={toWalletReceiver}
            />
            <WalletOperateItem
              icon={IconSend}
              title={t('pages.assets.token.transfer_send')}
              key='send'
              onClick={toWalletSend}
            />
            <WalletOperateItem
              icon={IconBuy}
              title={t('pages.assets.token.transfer_buy')}
              key='buy'
              //onClick={() => toSelectWalletNet("import")}
            />
          </div>
          <div className=' pb-4'>
            {!walletTxList.length && <Empty />}
            {Object.keys(list).map((key) => (
              <div className='mb-2' key={key}>
                <div className='text-blue-500 text-base mb-2'>{key}</div>
                <div className='rounded-2xl bg-gray-100 px-2'>
                  {list[key].map((item, i) => (
                    <WalletTransferItem key={i} item={item} onClick={() => toWalletTx(item)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        </LayoutThird> 
    );
}