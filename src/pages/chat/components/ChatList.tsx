import { User, Card, CardBody } from '@nextui-org/react';
import { useImperativeHandle, useMemo, useRef, forwardRef, Ref } from 'react';
import { unionBy } from 'lodash';
import { ROUTE_PATH } from '@/router';
import { ProfileAvatar } from './ProfileAvatar';
import { useThrottleFn, useDebounce } from 'react-use';
import { useNavigate } from 'react-router-dom';

interface Porps {
  messages: any[];
}
export const ChatList = forwardRef(
  ({ messages = [] }: Porps, ref: Ref<any>) => {
    const nav = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const handleScrollToBottom = () => {
      const container = containerRef.current;
      if (container?.scrollTo) {
        console.log('scroll to bottom');
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    };
    useImperativeHandle(ref, () => ({
      handleScrollToBottom,
    }));
    const list = useMemo(() => {
      return unionBy(messages, 'ID').sort((a, b) => a.TimeStamp - b.TimeStamp);
    }, [messages]);
    const toProfile = async (item: any) => {
      if (item.isMe) {
        nav(ROUTE_PATH.ACCOUNT_PROFILE);
        return;
      }
      nav(ROUTE_PATH.CHAT_PROFILE);
    };
    useDebounce(handleScrollToBottom, 300, [list]);
    return (
      <div className='h-full overflow-y-auto' ref={containerRef}>
        {list.map((v) => (
          <div
            key={v.ID}
            className={`mb-4 flex ${v.isMe ? 'flex-row-reverse' : ''}`}>
            <ProfileAvatar
              onClick={() => toProfile(v)}
              text={v.name}
              src={v.isMe ? v.publicKey : ''}
              className={`px-0 ${v.isMe ? 'ml-2' : 'mr-2'}`}
            />
            <Card className='max-w-[80%] w-fit'>
              <CardBody className={`py-2 ${v.isMe ? 'bg-blue-200' : ''}`}>
                {v.Content}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    );
  },
);
