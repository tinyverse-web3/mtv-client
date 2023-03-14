import { useWalletStore } from '@/store';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
const LOCAL_PASSWORD_KEY = '_keypassword';
import { useIdleTimer } from 'react-idle-timer';

export const LogoutIcon = () => {
  const nav = useNavigate();
  const resetWallet = useWalletStore((state) => state.reset);
  const logout = async () => {
    await Promise.all([resetWallet()]);
    sessionStorage.removeItem(LOCAL_PASSWORD_KEY);
    location.replace('/unlock');
  };
  const onIdle = () => {
    console.log(`window idle, user is level`);
    logout();
  };

  useIdleTimer({
    onIdle,
    timeout: 10 * 50 * 1000,
    throttle: 2000,
  });

  return (
    <Button
      light
      size='sm'
      auto
      className='px-1.5 text-5 ml-1'
      onPress={logout}>
      <div className='i-mdi-logout-variant'></div>
    </Button>
  );
};
