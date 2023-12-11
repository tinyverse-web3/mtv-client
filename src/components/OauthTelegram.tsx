import { Image } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button';

interface OauthTelegramProps {
  onChange?: (user: TelegramUser) => void;
}
export const OauthTelegram = ({ onChange }: OauthTelegramProps) => {
  const onTelegramAuth = (user: TelegramUser) => {
    console.log(user);
    onChange?.(user);
  };
  return (
    <div className='flex justify-center w-10 h-10 relative overflow-hidden'>
      <Image src='/icon-telegram.png' className='w-10 h-10' alt='google' />
      <div className='absolute top-0'>
        <TelegramLoginButton botName='ItToolBot' dataOnauth={onTelegramAuth} />
      </div>
    </div>
  );
};
