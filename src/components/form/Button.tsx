import { useRef, useEffect } from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
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
  color = 'messenger',
  className,
  fullWidth,
  radius,
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
    <ChakraButton
      className={`px-0 ${fullWidth ? 'w-full' : ''} ${className} `}
      style={{
        borderRadius: radius === 'full' ? '9999px' : '',
      }}
      isDisabled={disabled}
      colorScheme={color || 'messenger'}
      isLoading={loading}
      onClick={pressHandler}
      {...rest}>
      {children}
    </ChakraButton>
  );
};
