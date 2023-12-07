import TelegramLoginButton, { TelegramUser } from 'telegram-login-button';

export const TelegramLogin = () => {
  const onTelegramAuth = (user: TelegramUser) => {
    console.log(user);
  };

  return <TelegramLoginButton botName='ItToolBot' dataOnauth={onTelegramAuth} />;
};
