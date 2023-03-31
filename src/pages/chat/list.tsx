import { useRequest } from '@/api';
import { Address } from '@/components/Address';
import { useCheckLogin } from '@/components/BindMail';
import { Button } from '@/components/form/Button';
import Page from '@/layout/LayoutTwo';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore, useMtvdbStore, useNostrStore } from '@/store';
import { Card, Text, Input } from '@nextui-org/react';
import { addMinutes, format } from 'date-fns';
import { getPublicKey } from 'nostr-tools';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';

function addMinute(minute: number) {
  const currentTime = new Date(); // 获取当前时间
  const newTime = addMinutes(currentTime, 10);
  const formatDate = format(newTime, 'yyyy-MM-dd HH:mm:ss');
  return formatDate;
}
const NOSTR_KEY = 'nostr_sk';
export default function ChatList() {
  const [_, copyToClipboard] = useCopyToClipboard();
  const nav = useNavigate();
  const createNostr = useGlobalStore((state) => state.createNostr);
  const setNostr = useGlobalStore((state) => state.setNostr);
  const bindStatus = useGlobalStore((state) => state.bindStatus);
  const mtvDb = useMtvdbStore((state) => state.mtvDb);
  const mtvLoaded = useMtvdbStore((state) => state.loaded);
  const setRecipient = useNostrStore((state) => state.setRecipient);
  const addFriend = useNostrStore((state) => state.add);
  const removeFrient = useNostrStore((state) => state.remove);
  const friendList = useNostrStore((state) => state.list);
  const nostr = useGlobalStore((state) => state.nostr);

  const [imPkListArray, setImPkListArray] = useState<any>([]);
  const [imPkListMap, setImPkListMap] = useState<any>({});
  const [showShare, setShowShare] = useState(false);
  const [customPk, setCustomPk] = useState('');

  // const { data: imPublicPkListData, mutate: requestImPublicPkList } =
  //   useRequest<any[]>(
  //     {
  //       url: '/user/getimpubkeylist',
  //       arg: {
  //         method: 'get',
  //         auth: true,
  //       },
  //     },
  //     { revalidateOnMount: true },
  //   );

  const { mutate: sendPk } = useRequest({
    url: '/user/updateimpkey',
    arg: {
      method: 'post',
      auth: true,
      query: {
        nostrPublicKey: nostr?.pk,
      },
    },
  });

  const { mutate: requestImNotify } = useRequest<any[]>({
    url: '/im/notify',
    arg: {
      method: 'get',
      auth: true,
    },
  });

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
        console.log('生成的sk');
        console.log(sk);
        console.log(pk);
        await mtvDb.put(NOSTR_KEY, sk);
        await setNostr({ pk, sk });
      }
      if (bindStatus) {
        await sendPk();
        console.log('发送pk');
      }
    }
  };
  useEffect(() => {
    if (bindStatus) {
      sendPk();
    }
  }, [bindStatus]);
  const toDetail = async (cur: any) => {
    if (nostr?.sk) {
      await setRecipient({ pk: cur.pk });
      nav(ROUTE_PATH.CHAT_MESSAGE);
    }
  };
  // useLifecycles(() => {
  //   requestImPublicPkList();
  // });

  const checkImNotifyTick = async () => {
    const res = await requestImNotify();
    // res.data.reduce((prev: any, cur: any, index: number, data: any) => {
    //   const email = cur.toPublicKey,
    //     pk = cur.toPublicKey;
    //   imPkListMap[email] = pk;
    // });

    // setImPkListMap(imPkListMap);
    const _list = res.data || [];
    for (let i = 0; i < _list.length; i++) {
      const { toPublicKey } = _list[i];
      addFriend({ pk: toPublicKey });
    }
    // console.log(_imPkListArray);
    // Object.keys(imPkListMap).forEach((key, index) => {
    //   const value = imPkListMap[key];
    //   _imPkListArray.push({ email: key, nostrPublicKey: value });
    // });
    // setImPkListArray(_imPkListArray);
    setTimeout(checkImNotifyTick, 2000);
  };

  useEffect(() => {
    console.log('mtvLoaded ' + mtvLoaded);
    if (mtvLoaded) {
      getLocalNostr();
    }
  }, [mtvDb, mtvLoaded]);

  const refreshShareIm = async () => {
    const data = await createShareIm();
    console.log('refreshShareIm:%o', data);
  };

  const copyShareImLink = async () => {
    let link = window.location.origin + '/chat/imShare?pk=' + nostr?.pk;
    copyToClipboard(link);
    console.log('copyShareImL ink:%o', link);
  };

  const { mutate: createShareIm, loading: refreshImConnecting } = useRequest({
    url: '/im/createshareim',
    arg: {
      method: 'post',
      auth: true,
      query: {
        fromPublicKey: nostr?.pk,
      },
    },
  });
  const startIm = async () => {
    const isBind = await useCheckLogin();
    if (isBind && nostr?.sk) {
      refreshShareIm();
      checkImNotifyTick();
      setShowShare(true);
    }
  };
  const addCustomPk = () => {
    addFriend({ pk: customPk });
  };
  const removeItem = async (e: any, pk: string) => {
    e.stopPropagation();
    await removeFrient(pk);
  };
  return (
    <Page title='私密聊天' path={ROUTE_PATH.SPACE_INDEX}>
      {nostr?.pk && (
        <div className='mb-2 flex justify-center'>
          <Text>我的Nostr公钥：</Text>
          <Address address={nostr?.pk} />
        </div>
      )}
      <div className='flex'>
        <div className='flex-1 mb-2'>
          <Input
            value={customPk}
            aria-label='text'
            bordered
            onChange={(e) => setCustomPk(e.target.value)}
            fullWidth
            placeholder='输入对方公钥'></Input>
        </div>
        <Button className='ml-2' onPress={addCustomPk} auto>
          添加
        </Button>
      </div>

      <div className='mb-2'>历史聊天链接</div>
      <div className='max-h-60 overflow-y-auto mb-2'>
        {friendList
          ?.filter((s: any) => !!s.pk)
          ?.map((item: any) => (
            <div key={item.pk} className='mb-2'>
              <Card
                onClick={() => toDetail(item)}
                isPressable
                className='relative'
                variant='bordered'>
                <Card.Body className='py-2 pr-16'>
                  <Text className='break-all text-12px'>{item.pk}</Text>
                  <div>
                    <Text className='text-3'>
                      {format(item.time, 'yyyy-MM-dd')}
                    </Text>
                  </div>
                </Card.Body>
                <div
                  className='i-mdi-close absolute right-2 top-1/2 -translate-1/2 w-4 h-4'
                  onClick={(e) => removeItem(e, item.pk)}></div>
              </Card>
            </div>
          ))}
      </div>
      <Button onPress={startIm} className='mx-auto mb-2'>
        开启分享聊天
      </Button>
      {showShare && (
        <div>
          {nostr?.pk ? (
            <div>
              <Card className='w-60 m-auto'>
                <Card.Body>
                  <QRCode
                    size={256}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    value={
                      window.location.origin + '/chat/imShare?pk=' + nostr?.pk
                    }
                    viewBox={`0 0 256 256`}
                  />
                </Card.Body>
              </Card>
              <div className='text-center text-5 mb-4'>
                <Text>有效期：{addMinute(10)}</Text>
              </div>
              <div className='flex justify-center items-center'>
                <Button
                  auto
                  className='ml-4 min-w-20'
                  color='secondary'
                  loading={refreshImConnecting}
                  onPress={refreshShareIm}>
                  刷新分享链接
                </Button>
                <Button
                  auto
                  className='ml-4 min-w-20'
                  color='secondary'
                  onPress={copyShareImLink}>
                  复制分享链接
                </Button>
              </div>
            </div>
          ) : (
            <div className='mb-2 flex justify-center'>
              <Text>私聊共享缺少nostr公钥</Text>
            </div>
          )}
        </div>
      )}
    </Page>
  );
}
