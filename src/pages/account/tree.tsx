import { BranchLock } from './components/tree/BranchLock';
import { BranchNode } from './components/tree/BranchNode';
import TreeAi from '@/assets/images/tree-ai.png';
import TreeBoxOne from '@/assets/images/tree-box-1.png';
import TreeBoxTwo from '@/assets/images50/tree-box-2.png';
import LayoutThird from '@/layout/LayoutThird';

export default function Tree() {
  return (
    <LayoutThird showBack title={'账户管理'}>
      <div className='w-screen h-screen relative scale-90 -mt-[10%]'>
        <img
          src={TreeAi}
          className='w-[60px] h-[6-px] absolute  bottom-[90vh] left-1/2 -translate-x-1/2'
        />
        <div className='w-[90vw] h-[5px] absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#1296DB]'></div>

        <div className='w-[42px] h-[42px] absolute  bottom-[92vh] right-[10vw]'>
          <img src={TreeBoxOne} alt='' className='w-full h-full' />
          <div className='text-xs text-center text-[#63A103]'>保险箱</div>
        </div>
        <div className='h-[90vh] w-[3px] absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#1296DB]'></div>

        <div className='w-[50vw] h-[1px] absolute bottom-[80vh] left-[18vw]  tree-dashed'></div>
        <div className='absolute bottom-[80vh] left-[18vw] z-10'>
          <BranchNode text='隐私备份' status={3} />
        </div>
        <div className='absolute bottom-[60vh] left-1/2 -translate-x-[34vw]'>
          <BranchLock />
        </div>
        <div className='absolute bottom-[60vh]  -translate-x-1/2 left-[18vw] z-10'>
          <BranchNode text='隐私备份' status={2} />
        </div>
        <div className='w-[32vw] h-[3px] absolute bottom-[57vh] left-1/2 -translate-x-[97%] rotate-[20deg]  bg-[#1296DB]'></div>

        <div className='w-[50vw] h-[1px] absolute bottom-[50vh] left-[18vw]  tree-dashed'></div>
        <div className='absolute bottom-[50vh]  left-[18vw] z-10'>
          <BranchNode
            text={
              <>
                助记词
                <br />
                备份
              </>
            }
            status={3}
          />
        </div>
        <div className='absolute bottom-[30vh] left-1/2 -translate-x-[34vw]'>
          <BranchLock />
        </div>
        <div className='absolute bottom-[30vh] left-[18vw] z-10'>
          <BranchNode
            text={
              <>
                助记词
                <br />
                备份
              </>
            }
            status={1}
          />
        </div>
        <div className='w-[32vw] h-[3px] absolute bottom-[27vh] left-1/2 -translate-x-[97%] rotate-[20deg]  bg-[#1296DB]'></div>

        <div className='w-[1px] h-[30vh] absolute bottom-[50vh] left-[68vw]  tree-dashed-vertical'></div>

        <div className='w-[12vw] h-[1px] absolute bottom-[64vh] left-[68vw]  tree-dashed'></div>
        <div className='absolute bottom-[64vh]  right-[20vw]  z-10'>
          <BranchNode
            text={
              <>
                守护者
                <br />
                备份
              </>
            }
            status={3}
          />
        </div>
        <div className='absolute bottom-[44vh] left-1/2 translate-x-[27vw]'>
          <BranchLock />
        </div>
        <div className='absolute bottom-[44vh] right-[20vw]  z-10'>
          <BranchNode
            text={
              <>
                守护者
                <br />
                备份
              </>
            }
            status={2}
          />
        </div>
        <div className='w-[32vw] h-[3px] absolute bottom-[41vh] left-1/2 -translate-x-[3%] -rotate-[20deg]  bg-[#1296DB]'></div>

        <div className='absolute bottom-[21vh]  right-[20vw]  z-10'>
          <BranchNode
            text={
              <>
                智能继承
                <br />
                备份
              </>
            }
            status={4}
          />
        </div>
        <div className='w-[32vw] h-[3px] absolute bottom-[18vh] left-1/2 -translate-x-[3%] -rotate-[20deg] tree-dashed'></div>
      </div>
      <div className='p-4 -mt-8'>
        <div className='hint-text-box'>
          我们的账户是自我管理的web3账户，这是用户完全控制自己数据，掌控数据所有权的核心基础。在这里我们提供工具让用户能方便快捷做好账户的备份，保证账户的安全。重要提示：没有做好账户备份，用户数据会永久丢失。
        </div>
      </div>
    </LayoutThird>
  );
}
