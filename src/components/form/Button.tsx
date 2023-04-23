import { Button as NextButton, Loading } from '@nextui-org/react';

interface ButtonProps {
  loading?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button = ({
  loading,
  onPress,
  children,
  disabled,
  ...rest
}: ButtonProps & any) => {
  const pressHandler = (e: any) => {
    if (loading || disabled) return;
    onPress?.();
  };
  return (
    <NextButton disabled={disabled} {...rest} onPressEnd={pressHandler}>
      {loading ? (
        <Loading type='spinner' size='sm' color='currentColor' />
      ) : (
        children
      )}
    </NextButton>
  );
};
