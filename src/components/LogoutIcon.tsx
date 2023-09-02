import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';

export const LogoutIcon = () => {
  const nav = useNavigate();
  const logout = async () => {
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
