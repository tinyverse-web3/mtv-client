import TelegramLoginButton, { TelegramUser } from 'telegram-login-button';

export const TelegramLogin = () => {
  const onTelegramAuth = (user: TelegramUser) => {
    console.log(onTelegramAuth);
  };

  return <TelegramLoginButton botName='6637121890:AAEnxTTF7FfKD_0bUzIT0n1red2fcUG68Sc' dataOnauth={onTelegramAuth} />;
};
