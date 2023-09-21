import { useHost } from '@/lib/hooks';
import { useMemo, useState } from 'react';
import { Image } from '@nextui-org/react';

export const ProfileAvatar = ({
  DestPubkey,
  className,
}: {
  DestPubkey: string;
  className?: string;
}) => {
  const apiHost = useHost();
  const [error, setError] = useState(false);
  const imageSrc = useMemo(() => {
    return DestPubkey && !error
      ? `${apiHost}/sdk/msg/getAvatar?DestPubkey=${DestPubkey}`
      : '/logo.png';
  }, [DestPubkey, error]);
  return (
    <Image
      src={imageSrc}
      className={`${className}`}
      onError={() => setError(true)}
    />
  );
};
