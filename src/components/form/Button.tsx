import { Button as NextButton, Loading } from '@nextui-org/react';

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
  className,
  ...rest
}: ButtonProps & any) => {
  const pressHandler = (e: any) => {
    if (loading || disabled) return;
    if (onPress) {
      onPress?.()
    } else if (onClick) {
      onClick?.(e)
    }
  };
  return (
    <NextButton
      className={`rounded-2 text-4 p-0 ${className}`}
      disabled={disabled}
      {...rest}>
      <div className='w-full h-full px-2 flex items-center justify-center' onClick={pressHandler}>
        {loading ? (
          <Loading type='spinner' size='sm' color='currentColor' />
        ) : (
          children
        )}
      </div>
    </NextButton>
  );
};
