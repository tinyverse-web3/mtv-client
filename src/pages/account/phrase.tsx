import { Card, Text, Button } from '@nextui-org/react';
import { useWalletStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';

export default function UserPhrase() {
  const wallet = useWalletStore((state) => state.wallet);
  return (
    <LayoutThird title='我的资料' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-4'>
        <Text className='text-4 mb-4'>助记词非常重要，请妥善保管，注意不使用联网工具备份。</Text>
        <Card className='mb-4'>
          <Card.Body>
            <Text>{wallet?.getMnemonic()}</Text>
          </Card.Body>
        </Card>
        <Button className='w-full' size='lg'>下一步</Button>
      </div>
    </LayoutThird>
  );
}
