import { User, Card, Row } from '@nextui-org/react';

interface Porps {
  messages: any[];
}
export const ChatList = ({ messages }: Porps) => {
  return (
    <div className='h-full overflow-y-auto'>
      {messages.map((v) => (
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
