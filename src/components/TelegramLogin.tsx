import { useEffect } from 'react';
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button';

export const TelegramLogin = () => {
  const onTelegramAuth = (user: TelegramUser) => {
    console.log(user);
  };
  return <div className="flex justify-center"><TelegramLoginButton botName='ItToolBot' dataOnauth={onTelegramAuth} /></div>;
};
