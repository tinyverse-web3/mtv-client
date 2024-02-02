import { Image } from '@nextui-org/react';
import IconDel from "@/assets/images/wallet/icon-del.png";
import IconEdit from "@/assets/images/wallet/icon-edit.png";

interface ManageWalletItemProps {
  icon?: string;
  name: string;
  type: string;
  address: string;
  onClick?: () => void;
  onClickDel: () => void;
  onClickEdit: () => void;
}
export const ManageWalletItem = ({
  icon,
  name,
  type,
  address,
  onClick,
  onClickDel,
  onClickEdit
}: ManageWalletItemProps) => {
  return (
    <div className='flex items-center mb-4'>
      <Image src={IconDel} className='w-8 h-8 mr-1' onClick={onClickDel}></Image>
      <div
        className='flex items-center justify-between h-16 w-full bg-gray-100 px-4 rounded-2xl '
        onClick={() => onClick?.()}>
        <div className='flex items-center'>
          {icon && (
            <Image src={icon} className='w-6 h-6 mr-6'></Image>
          )}
           <div className='ml-2'>
            <p className='text-md mb-2'>{name}</p>
            <p className='text-xs text-gray-500'>{type}</p>
          </div>
        </div>
      </div>
      <Image src={IconEdit} className='w-8 h-8 ml-1' onClick={onClickEdit}></Image>
     </div>
  );
  
};
