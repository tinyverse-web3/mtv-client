import { Button as NextButton, Loading } from '@nextui-org/react';

interface Props {
  loading?: boolean;
  onPress?: () => void;
}
export const Button = ({
  loading,
  onPress,
  children,
  ...rest
}: Props & any) => {
  const pressHandler = () => {
    if (loading || rest.disbaled) return;
    onPress && onPress();
  };
  return (
    <NextButton {...rest} onPress={pressHandler}>
      {loading ? (
        <Loading type='spinner' color='currentColor' size='sm' />
      ) : (
        children
      )}
    </NextButton>
  );
};
