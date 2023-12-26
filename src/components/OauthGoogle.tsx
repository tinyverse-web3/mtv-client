import { Image } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
interface OauthGoogleProps {
  onChange?: (code: string) => void;
}
export const OauthGoogle = ({ onChange }: OauthGoogleProps) => {
  const auth = async () => {
    window?.JsBridge.startGoogleLogin(({ code, message, data }: any) => {
      console.log('jsbridge google login', code, message, data);
      if (code === 0) {
        try {
          onChange?.(data);
        } catch (error) {
          console.error(error);
        }
        // toast.success(message);
      } else {
        toast.error(message);
      }
    });
  };
  return (
    <div className='flex justify-center' onClick={auth}>
      <Image src='/icon-google.png' className='w-8 h-8' alt='google' />
    </div>
  );
};
