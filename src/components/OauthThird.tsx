import { Box, Divider, AbsoluteCenter, HStack } from '@chakra-ui/react';
import { OauthGoogle } from './OauthGoogle';
import { OauthTelegram } from './OauthTelegram';
interface OauthThirdProps {
  onGoogleChange?: (code: string) => void;
  onTelegramChange?: (user: any) => void;
}
export const OauthThird = ({
  onGoogleChange,
  onTelegramChange,
}: OauthThirdProps) => {
  return (
    <div className='pb-4'>
      <Box position='relative' className='py-4'>
        <Divider />
        <AbsoluteCenter bg='white' px='4'>
          Or
        </AbsoluteCenter>
      </Box>
      <HStack spacing='24px' justify='center'>
        <OauthGoogle onChange={onGoogleChange} />
        <OauthTelegram onChange={onTelegramChange} />
      </HStack>
    </div>
  );
};
