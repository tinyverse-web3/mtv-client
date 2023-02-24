import { Container, Button } from '@nextui-org/react';
// import { useRouter } from 'next/navigation';
import Page from '@/layout/page';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const nav = useNavigate();
  const toRestore = () => {
    nav('/restore');
  };
  const toCreate = () => {
    nav('/create');
  };
  return (
    <Page showBack={false}>
      <div className='pt-20'>
        <Button
          size='xl'
          className='m-auto mb-6'
          onPress={toCreate}
          color='success'>
          创建
        </Button>
        <Button
          color='secondary'
          className='m-auto mb-6'
          onPress={toRestore}
          size='xl'>
          恢复
        </Button>
      </div>
    </Page>
  );
}
