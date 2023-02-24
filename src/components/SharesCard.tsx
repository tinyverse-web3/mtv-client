import { useEffect, useState, useRef } from 'react';
import { Button, Modal, Text, Card } from '@nextui-org/react';
import { useCopyToClipboard } from 'react-use';
import { Shamir } from '@/lib/account';
import { SendEmail } from '@/components/SendEmail';
import { useRequest } from '@/api';
import { useWalletStore } from '@/store';

export const SharesCard = () => {
  const [shares, setShares] = useState<string[]>([]);
  const wallet = useWalletStore((state) => state.wallet);
  const [copied, setCopied] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  const modifySuccess = (res: any) => {
    console.log(res);
  };
  const { trigger: modifyuser } = useRequest(
    {
      path: '/user/modifyuser',
      method: 'post',
      auth: true,
      query: {
        sssData: shares[1],
        publicKey: wallet?.wallet?.publicKey,
        address: wallet?.wallet?.address,
      },
    },
    { onSuccess: modifySuccess },
  );

  const splitKey = async () => {
    const sss = new Shamir();
    const { privateKey } = wallet?.wallet || {};
    if (privateKey) {
      const splitShares: any[] = await sss.split(privateKey, 2, 3);
      const hexShares = splitShares.map((s) => s.toString('hex'))
      setShares(hexShares);
      console.log(hexShares[1].length);
    }
  };
  useEffect(() => {
    if (shares?.length) {
      modifyuser();
    }
  }, [shares])
  const hintMap: any = {
    0: '该片存本地，由用户保存，请复制。',
    1: '该片由MTV加密存储',
    2: '该片通过邮件发送到指定邮箱，请点击发送',
  };
  const copy = (str: string): void => {
    copyToClipboard(str);
  };
  return (
    <div>
      <Button
        flat
        className='w-full mb-4'
        size='xl'
        color='error'
        onPress={splitKey}>
        分片导出
      </Button>

      {!!shares.length && (
        <>
          <div className='mb-4'>
            <Card>
              <Card.Body className='px-2 py-2 flex flex-row items-center'>
                <Text className='flex-1 overflow-x-auto'>{shares[0]}</Text>
                <Button
                  className='min-w-6 ml-4'
                  onPress={() => copyToClipboard(shares[0])}>
                  复制
                </Button>
              </Card.Body>
            </Card>
            <div className='text-center mt-1'>
              <Text className='text-3'>{hintMap[0]}</Text>
            </div>
          </div>
          <div className='mb-4'>
            <Card>
              <Card.Body className='px-2 py-2 flex flex-row items-center'>
                <Text className='flex-1 overflow-x-auto'>{shares[1]}</Text>
                <Button className='min-w-6 ml-4'>发送</Button>
              </Card.Body>
            </Card>
            <div className='text-center mt-1'>
              <Text className='text-3'>{hintMap[1]}</Text>
            </div>
          </div>
          <div className='mb-4'>
            <Card>
              <Card.Body className='px-2 py-2 flex flex-row items-center'>
                <Text className='flex-1 overflow-x-auto'>{shares[2]}</Text>
                <SendEmail content={shares[2]} />
              </Card.Body>
            </Card>
            <div className='text-center mt-1'>
              <Text className='text-3'>{hintMap[2]}</Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
