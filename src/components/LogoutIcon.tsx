import { useWalletStore, useGlobalStore, useNostrStore } from '@/store';
import { Button, useTheme } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
export const LogoutIcon = () => {
  const nav = useNavigate();
  const resetWallet = useWalletStore((state) => state.reset);
  const wallet = useWalletStore((state) => state.wallet);
  const resetGlobal = useGlobalStore((state) => state.reset);
  const resetNostr = useNostrStore((state) => state.reset);
  const logout = async (e: any) => {
    await Promise.all([
      resetNostr(),
      resetWallet(),
      resetGlobal(),
      wallet?.deleteKeystore(),
    ]);
    nav('/', { replace: true });
  };
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
