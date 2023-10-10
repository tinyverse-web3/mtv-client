import react from 'react';
interface BranchNodeProps {
  text?: react.ReactNode;
  status?: 1 | 2 | 3 | 4;
  onClick?: () => void;
}
export const BranchNode = ({ text, status, onClick }: BranchNodeProps) => {
  return (
    <div className='w-[1px] h-[1px] relative'>
      <div
        onClick={onClick}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full flex justify-center items-center ${
          status === 1 && 'border-2 border-[#1296DB] bg-white text-[#1296DB]'
        } ${status === 2 && 'bg-[#1296DB] text-white '} ${
          status === 3 && 'bg-gray-500 text-white'
        } ${status === 4 && 'bg-blue-400 text-white'}`}>
        <span className='text-[10px] break-words text-center scale-80'>{text}</span>
      </div>
    </div>
  );
};
