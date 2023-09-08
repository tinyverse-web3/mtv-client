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
  const pressHandler = (e: any) => {
    if (loading || disabled) return;
    if (onPress) {
      onPress?.();
    } else if (onClick) {
      onClick?.(e);
    }
  };
  return (
    <NextButton
      className={` ${className}`}
      isDisabled={disabled}
      color={color}
      {...rest}>
      <div
        className='w-full h-full px-2 flex items-center justify-center'
        onClick={pressHandler}>
        {loading ? <Spinner size='sm' color='white' /> : <>{children}</>}
      </div>
    </NextButton>
  );
};
