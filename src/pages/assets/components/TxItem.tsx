interface TxItemProps {
  item: {
    name: string;
    time: string;
    num: number;
    sender: string;
    comment: string;
    type: 0 | 1;
  };
}
const TxItem = ({ item }: TxItemProps) => {
  return (
    <div>
      <div className='flex'>
        <span>发送方：</span>
        <span>{item.sender}</span>
      </div>
    </div>
  );
};
