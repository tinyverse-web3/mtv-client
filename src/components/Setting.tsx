import { useState } from 'react';
import { Button, Modal, Text, Card } from '@nextui-org/react';
import { useCopyToClipboard } from 'react-use';
import { Shamir } from '@/lib/account';
import { useWalletStore } from '@/store';

export const Setting = () => {
  const [visible, setVisible] = useState(false);
  const [pharseVisible, setPharseVisible] = useState(false);
  const wallet = useWalletStore((state) => state.wallet);
  const { phrase } = wallet?.wallet?.mnemonic || {};
  const [{ value, error, noUserInteraction }, copyToClipboard] =
    useCopyToClipboard();

  const pressHander = () => {
    setVisible(true);
  };
  const splitKey = async () => {
    const sss = new Shamir();
    if (wallet?.wallet) {
      const { privateKey } = wallet.wallet;
      const shares = await sss.split(privateKey, 2, 3);
      console.log(shares[0].toString('hex'));
      console.log(shares[1].toString('hex'));
      console.log(shares[2].toString('hex'));
    }
  };
  const showPharse = () => {
    if (phrase) {
      copyToClipboard(phrase);
      if (pharseVisible == true) return;
      setPharseVisible(true);
      setTimeout(() => {
        setPharseVisible(false);
      }, 1000 * 5);
    }
  };
  const closeHandler = () => {
    setVisible(false);
    console.log('closed');
  };
  return (
    <div>
      <Button light size='sm' auto onPress={pressHander} className='px-1.5'>
        <div className='i-material-symbols-settings'></div>
      </Button>
      <Modal
        closeButton
        blur
        aria-labelledby='modal-title'
        open={visible}
        onClose={closeHandler}>
        <Modal.Header>
          <Text id='modal-title' size={18}>
            设置
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Button auto flat color='error' onPress={showPharse}>
            备份助记词
          </Button>
          <Button auto flat color='error' onPress={splitKey}>
            分片计算
          </Button>
          {pharseVisible ? (
            <Card>
              <Card.Body>
                <Text>{phrase}</Text>
              </Card.Body>
            </Card>
          ) : (
            <></>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color='error' onPress={closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
