import TreeLink from '@/assets/images/tree-link.png';
interface BranchNodeProps {
  isLock?: boolean;
}
export const BranchLock = ({ isLock = true }: BranchNodeProps) => {
  return (
    <div className='relative flex flex-col items-center w-[6vw] h-[20vh]'>
      <div className='w-[3px] h-full bg-[#1296DB] flex-1'></div>
      <div className='h-[6vw] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[6vw]'>
        {isLock && (
          <img src={TreeLink} alt='' className='w-[6vw] translate rotate-90 -translate-x-[0.005vw]' />
        )}
      </div>
    </div>
  );
};
