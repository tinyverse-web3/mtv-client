import { Badge } from '@nextui-org/react';
import { useGlobalStore } from '@/store';

export const MaintainWarnBadge = () => {
  const maintain = useGlobalStore((state) => state);
  return !maintain ? (
    <Badge color='warning'>帐号还没有维护，可能永久丢失</Badge>
  ) : (
    <></>
  );
};
