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
    <div className='flex justify-center relative overflow-hidden'>
      {/* <Image src='/icon-telegram.png' className='w-10 h-10' alt='google' /> */}
      <TelegramLoginButton botName='ItToolBot' dataOnauth={onTelegramAuth} buttonSize='small'/>
    </div>
  );
};
