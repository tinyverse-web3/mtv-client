interface EmptyProps {
  text?: string;
}
export const Empty = ({ text = '暂无数据' }: EmptyProps) => {
  return (
    <div className='w-full h-20 flex flex-col justify-center items-center'>
      <span>{text}</span>
    </div>
  );
};
