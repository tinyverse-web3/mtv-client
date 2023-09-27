import { useRef, useEffect } from 'react';
import { Button as NextButton } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
interface ButtonProps {
  loading?: boolean;
  onPress?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button = ({
  loading,
  onPress,
  onClick,
  children,
  disabled,
  color = 'primary',
  className,
  ...rest
}: ButtonProps & any) => {
  const btnElement = useRef<any>();
  const pressHandler = (e: any) => {
    if (loading || disabled) return;
    if (onPress) {
      onPress?.();
    } else if (onClick) {
      onClick?.(e);
    }
    return false;
  };
  // useEffect(() => {
  //   document.addEventListener('click', pressHandler);
  //   if (btnElement.current) {
  //     btnElement.current.addEventListener('click', pressHandler);
  //   }
  // }, []);
  return (
    <NextButton
      className={`px-0 ${className}`}
      isDisabled={disabled}
      onPressStart={pressHandler}
      color={disabled ? 'default' : color}
      {...rest}>
      <div
        className='h-full px-2 flex items-center justify-center'
        ref={btnElement}>
        {loading ? <Spinner size='sm' color='white' /> : <>{children}</>}
      </div>
    </NextButton>
  );
};
