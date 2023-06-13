import { User, Card, Row } from '@nextui-org/react';
import { useEffect, useMemo, useRef } from 'react';
import { unionBy } from 'lodash';
import { useThrottleFn, useDebounce } from 'react-use';

interface Porps {
  messages: any[];
}
export const ChatList = ({ messages = [] }: Porps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleScrollToBottom = () => {
    const container = containerRef.current;
    if (container?.scrollTo) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };
  const list = useMemo(() => {
    return unionBy(messages, 'timeStamp').sort(
      (a, b) => a.timeStamp - b.timeStamp,
    );
  }, [messages]);
  useDebounce(handleScrollToBottom, 300, [list]);

  return (
    <div className='h-full overflow-y-auto' ref={containerRef}>
      {list.map((v) => (
        <div
          key={v.timeStamp}
          className={`mb-4 flex ${v.isMe ? 'flex-row-reverse' : ''}`}>
          <User
            name=''
            text={v.name || v.publicKey.replace('0x', '')}
            className={`px-0 ${v.isMe ? 'ml-2' : ''}`}
          />
          <Card className='max-w-60% w-fit'>
            <Card.Body className='py-2'>{v.content}</Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};
