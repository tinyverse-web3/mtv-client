import { useRequest } from '@/api';
import { Button } from '@/components/form/Button';
import Page from '@/layout/page';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore, useMtvdbStore, useNostrStore } from '@/store';
import { Card, Spacer, Text } from '@nextui-org/react';
import { getPublicKey } from 'nostr-tools';
import { useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard, useLifecycles } from 'react-use';

function addMinute(minute:number) {
  let date = new Date();
  date.setMinutes(date.getMinutes()+minute); 
  let month = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
  let day = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
  let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
  let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
  let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
  let formatDate = date.getFullYear()+'-'+month+'-'+day + " " + hours + ":" + minutes + ":" + seconds;
  return formatDate;
}


const NOSTR_KEY = 'nostr_sk';
export default function ChatList() {
  const [{ value, error, noUserInteraction }, copyToClipboard] = useCopyToClipboard();
  const nav = useNavigate();
  const createNostr = useGlobalStore((state) => state.createNostr);
  const setNostr = useGlobalStore((state) => state.setNostr);
  const mtvDb = useMtvdbStore((state) => state.mtvDb);
  const mtvLoaded = useMtvdbStore((state) => state.loaded);
  const setRecipient = useNostrStore((state) => state.setRecipient);
  const nostr = useGlobalStore((state) => state.nostr);

  var { data: imPkListData, mutate: requestImPkList } = useRequest<any[]>(
    {
      url: '/user/getimpubkeylist',
      arg: {
        method: 'get',
        auth: true,
      },
    },
    { revalidateOnMount: true },
  );
  const { mutate: sendPk } = useRequest({
    url: '/user/modifyuser',
    arg: {
      method: 'post',
      auth: true,
      query: {
        nostrPublicKey: nostr?.pk,
      },
    },
  });
  const { data: imNotifyData, mutate: requestImNotify } = useRequest<any[]>(
    {
      url: '/im/notify',
      arg: {
        method: 'get',
        auth: true,
      },
    },
  );
  const getLocalNostr = async () => {
    // console.log('本地获取nostr');
    // console.log(mtvDb?.kvdb);
    if (mtvDb?.kvdb) {
      const localSk = await mtvDb.get(NOSTR_KEY);
      console.log('localSk');
      console.log(localSk);
      if (localSk) {
        const pk = getPublicKey(localSk);
        console.log(pk);
        await setNostr({ pk, sk: localSk });
      } else {
        const { sk, pk } = await createNostr();
        console.log('生成的sk')
        console.log(sk)
        console.log(pk)
        await mtvDb.put(NOSTR_KEY, sk);
        // await mtvDb.backupDb();
        await setNostr({ pk, sk });
      }
      // await sendPk();
    }
  };
  const toDetail = async (cur: any) => {
    await setRecipient({ pk: cur.nostrPublicKey, email: cur.email });
    nav(ROUTE_PATH.CHAT_MESSAGE);
  };
  const removeItem = async (e: any, id: string) => {
    e.stopPropagation();
  };
  useLifecycles(() => {
    // requestImPkList();
  });
  const checkImNotifyTick = ():any => {
    let timerId:any;
    const run = async (imNotifyList:any) => {
      await requestImNotify()
      if (imNotifyList) {
        var newPkList = [];
        for (let index = 0; index < imNotifyList.length; index++) {
          const imNotifyItem = imNotifyList[index];
          const findPkInImPkList = (pk:string):string => {
            if (imPkListData) {
              for (let index = 0; index < imPkListData.length; index++) {
                const item = imPkListData[index];
                if (pk === item.nostrPublicKey) {
                  return pk
                }
              }
            }
            return "";
          }
          const findPk = findPkInImPkList(imNotifyItem.toPublicKey);
          if (!findPk) {
            newPkList.push({
              email: imNotifyItem.toPublicKey, 
              nostrPublicKey: imNotifyItem.toPublicKey
            })
          }
        }
      }
    };
    timerId = setInterval(run, 2000, imNotifyData);
    return timerId;
  };
  useEffect(() => {
    console.log('mtvLoaded ' + mtvLoaded);
    if (mtvLoaded) {
      getLocalNostr();
      refreshShareIm();
      var timerId = checkImNotifyTick();
      return () => {
        timerId && clearInterval(timerId);
      }
    }
  }, [mtvDb, mtvLoaded]);
  const refreshShareIm = async () => {
    const data = await createShareIm();
    console.log("refreshShareIm:%o", data);
  };
  const copyShareImLink = async () => {
    let link = window.location.origin + "/chat/imShare?pk=" + nostr?.pk
    copyToClipboard(link);
    console.log("copyShareImLink:%o", link);
  };
  const { mutate: createShareIm, loading: refreshImConnecting } = useRequest({
    url: '/im/createshareim',
    arg: {
      method: 'post',
      auth: true,
    },
  });
  

  return (
    <Page title='私密聊天' path={ROUTE_PATH.HOME}>
      <div className='py-6'>
        {imPkListData?.filter(s => !!s.nostrPublicKey)?.map((item) => (
          <div key={item.email}>
            <Card onClick={() => toDetail(item)} isPressable variant='bordered'>
              <Card.Body>
                <Text>{item.email}</Text>
              </Card.Body>
              {/* <div
                className='i-mdi-close absolute right-2 top-1/2 -translate-1/2 w-6 h-6'
                onClick={(e) => removeItem(e, item.pk)}></div> */}
            </Card>
            <Spacer y={1} />
          </div>
        ))}
        {/* <Button onPress={getLocalNostr}>创建</Button> */}
      </div>
      <div>
        <QRCode 
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={ window.location.origin + "/chat/imShare?pk=" + nostr?.pk}
        viewBox={`0 0 256 256`}
        />
        <Button
                auto
                className='ml-4 min-w-20'
                color='secondary'
                loading={refreshImConnecting}
                onPress={refreshShareIm}>
                {"刷新(私聊结束时间："+ addMinute(10) + ")"}
        </Button>
        
      </div>
      <div style= {{ marginTop:5}}>
      <Button
                auto
                className='ml-4 min-w-20'
                color='secondary'
                onPress={copyShareImLink}>
                {"复制私聊共享链接"}
        </Button>
      </div>

    </Page>
    
  );
}
