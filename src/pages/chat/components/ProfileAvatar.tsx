import { User, Avatar } from '@nextui-org/react';
import { useMemo, useState } from 'react';

interface ProfileAvatarProps {
  text?: string;
  src?: string;
  onClick: () => void;
  className?: string;
}
export const ProfileAvatar = ({
  text,
  src,
  onClick,
  className,
}: ProfileAvatarProps) => {
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const imageSrc = useMemo(() => {
    return src ? `${apiHost}/sdk/msg/getAvatar?DestPubkey=${src}` : '/logo.png';
  }, [src]);
  return (
    <Avatar
      name={text}
      src={imageSrc}
      onClick={onClick}
      className={className}
    />
  );
};
