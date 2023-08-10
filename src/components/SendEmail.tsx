import { useState } from 'react';
import { Modal, Button, Text, Input, Row, Checkbox } from '@nextui-org/react';

interface Props {
  content: string;
}
export const SendEmail = ({ content }: Props) => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');

  const sendEmail = (): void => {
    window.open(
      `mailto:${email}?subject=分片数据&body=分片秘钥为：${content}`,
      '_blank',
    );
  };

  const closeHandler = () => {
    setVisible(false);
    document.body.removeAttribute('style');
    console.log('closed');
  };
  const sendHandler = () => {
    sendEmail();
    setVisible(false);
  };

  return (
    <div>
      <Button className='min-w-6 ml-4' aria-label='open email' onPress={() => setVisible(true)}>
        Email
      </Button>
      <Modal
        closeButton
        aria-labelledby='modal-title'
        open={visible}
        onClose={closeHandler}>
        <Modal.Header>
          <Text id='modal-title' size={18}>
            发送分片到指定邮箱
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            className='h-50px'
            color='primary'
            size='lg'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            contentLeft={<div className='i-mdi-email' />}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color='error' onPress={closeHandler}>
            关闭
          </Button>
          <Button auto onPress={sendHandler}>
            发送
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
