import { format } from 'date-fns';
import { GunSummy } from '@/store';
import { add, getTime } from 'date-fns';
export const GunItem = (item: GunSummy) => {
  let color = '';
  const today = new Date();
  const tomorrow = getTime(add(today, { days: 1 }));
  if (item.expired > tomorrow) {
    color = '#11EE11';
  } else if (item.expired < getTime(today)) {
    color = '#EE3D11';
  } else {
    color = '#DDB822';
  }
  const style = { color: color };

  let expired = '';
  if (item.expired != 0) {
    expired = 'Expired data :' + format(item.expired, 'yyyy-MM-dd');
  }

  return (
    <div>
      <div className='absolute left top-1/2 -translate-1/2 w-6 h-6'>
        <img src='/icon-restore.png' />
      </div>

      <div className=' px-4'>
        <div className='flex items-center text-4'>{item.name}</div>

        <div>
          <div className='text-3' style={style}>
            {expired}
          </div>
        </div>
      </div>
    </div>
  );
};
