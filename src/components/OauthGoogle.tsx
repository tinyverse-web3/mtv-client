import { Image } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';

interface OauthGoogleProps {
  onChange?: (code: string) => void;
}
export const OauthGoogle = ({ onChange }: OauthGoogleProps) => {
  const oauthGoogle = useGoogleLogin({
    onSuccess: ({ code }) => {
      if (code) {
        onChange?.(code);
      }
    },
    flow: 'auth-code',
  });
  return <div className='flex justify-center' onClick={oauthGoogle}>
    <Image src='/icon-google.png' className='w-8 h-8' alt='google' />
  </div>;
};
