import LayoutThird from '@/layout/LayoutThird';
import { useMemo, useState } from 'react';
import { Button } from '@/components/form/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePoint } from '@/lib/hooks';
import { useAccountStore, useAssetsStore } from '@/store';
import { format } from 'date-fns';
import { AssetsTokenDetailItem } from '../components/AssetsTokenDetailItem';
import { TxItem } from '../components/TxItem';
import { ROUTE_PATH } from '@/router';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import account from '@/lib/account/account';
import { useEffect } from 'react';
import { groupBy } from 'lodash';
import { WalletOperateItem } from '../components/WalletOperateItem';
import IconReceive from "@/assets/images/wallet/icon-receive.png";
import IconSend from "@/assets/images/wallet/icon-send.png";
import { WalletHeader } from "../components/WalletHeader";
import { hideStr } from "@/lib/utils";
import { useWalletAssetsStore, useWalletStore } from "@/store";
import { useMap } from 'react-use';

export default function TokenDetail() {
  const nav = useNavigate();
  const { t } = useTranslation();
  // const [tvsTxList, { set: setTxList }] = useList<any>([]);
  const [moreAddr, setMoreAddr] = useState('');
  const { balance: pointBalance } = usePoint();
  const { tvsTxList, setTvsTxList, setTvsTx } = useAssetsStore((state) => state);
  const { getByName } = useWalletStore((state) => state);
  const { accountInfo } = useAccountStore((state) => state);
  const [data, { set, setAll, remove, reset, get }] = useMap({
    Name: '',
    Address: '',
    Type: '',
    BalanceDollar: '',
    Balance: '',
    Transfer: [],
  });

  const feachDetails = async () => {
    const detail = await getByName("", "Tinyverse");
    setAll(detail as any);
  }

  const getTvsTxList = async () => {
    const { data } = await account.getTvsTxList();
    const list = data?.data || [];
    setTvsTxList(list);
    setMoreAddr(data?.more);
  };
  const getTvsTxListMore = async () => {
    if (!moreAddr) return;
    const { code, data } = await account.getTvsTxListMore(moreAddr);
    const list = data?.txItems || [];
    setTvsTxList(tvsTxList.concat(list));
    setMoreAddr(data?.more);
  };
  const toTransfer = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_TRANSFER);
  };
  const toReceiver = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_RECEIVER);
  };
  const list = useMemo(() => {
    return groupBy(
      tvsTxList.map((v) => ({ ...v, timeText: format(v.txTime, 'yyyy-MM') })),
      'timeText',
    );
  }, [tvsTxList]);
  const toTx = (item: any) => {
    setTvsTx(item);
    nav(ROUTE_PATH.ASSETS_TOKEN_TX);
  };
  useEffect(() => {
    // feachDetails();
    getTvsTxList();
  }, []);
 
  return (
    <LayoutThird title={`TVS ${t('pages.assets.token.detail_title')}`} onRefresh={getTvsTxList} onLoad={getTvsTxListMore} rightContent={
        <Icon icon='material-symbols:more-vert' className='text-xl text-blue-500'></Icon>
      }>
      <div className='p-4'>
        {/* <div className='mb-6'>
          <AssetsTokenDetailItem icon='/logo.png' symbol={t('pages.assets.token.point_name')} key='point' balance={pointBalance}/>
        </div> */}
        <div className='mb-5'>
          <WalletHeader icon='/logo.png' address={hideStr(accountInfo.address, 4)} dollar={pointBalance} key='balance' type='Tinyverse'/>
        </div>

        {/* <div className='bg-gray-100  rounded-3xl p-2 flex  items-center justify-between mb-2'>
          <Button radius='full' className='h-12 flex-1' variant='outline' onClick={toTransfer}>
            <Icon icon='mdi:arrow-up-bold-circle-outline' className='text-2xl mr-2 '/>
            <div className='tex'>{t('pages.assets.transfer.title')}</div>
          </Button>
          <Button radius='full' className='h-12 flex-1 ml-8' onClick={toReceiver}>
            <Icon icon='mingcute:qrcode-2-line' className='text-2xl mr-2' />
            <div className=''>{t('pages.assets.btn_receiver')}</div>
          </Button>
        </div> */}
        <div className='flex mb-5 gap-3'>
          <WalletOperateItem icon={IconReceive} title={t('pages.assets.token.transfer_receive')} key='receive' onClick={toReceiver}/>
          <WalletOperateItem icon={IconSend} title={t('pages.assets.token.transfer_send')} key='send' onClick={toTransfer}/>
        </div>
        <div className='pb-4'>
          {Object.keys(list).map((key) => (
            <div className='mb-2' key={key}>
              <div className='text-blue-500 text-base mb-2'>{key}</div>
              <div className='rounded-2xl bg-gray-100 px-2'>
                {list[key].map((item, i) => (
                  <TxItem key={i} item={item} onClick={() => toTx(item)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutThird>
  );
}
