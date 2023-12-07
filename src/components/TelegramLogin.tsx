import TelegramLoginButton, { TelegramUser } from 'telegram-login-button';

export const TelegramLogin = () => {
  const onTelegramAuth = (user: TelegramUser) => {
    console.log(onTelegramAuth);
  };

  return <TelegramLoginButton botName='ItToolBot' dataOnauth={onTelegramAuth} />;
};
