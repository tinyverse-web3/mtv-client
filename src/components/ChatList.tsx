import { User, Card, Row } from '@nextui-org/react';
import { useMemo } from 'react';
import { unionBy } from 'lodash';

interface Porps {
  messages: any[];
}
export const ChatList = ({ messages = [] }: Porps) => {
  const list = useMemo(() => {
    return unionBy(messages, 'id');
  }, [messages]);
  return (
    <div className='h-full overflow-y-auto'>
      {list.map((v) => (
        <div
          key={v.id}
          className={`mb-4 flex ${v.me ? 'flex-row-reverse' : ''}`}>
          <User
            name=''
            text={v.email || v.pubkey}
            className={`px-0 ${v.me ? 'ml-2' : ''}`}
          />
          <Card className='max-w-60% w-fit'>
            <Card.Body className='py-2'>{v.text}</Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};
