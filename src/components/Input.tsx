import { IInputProps, Input as NativeBaseInput } from 'native-base'

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg={'gray.50'}
      h={13}
      px={4}
      borderWidth={1}
      rounded={'md'}
      borderColor={'gray.100'}
      fontSize="sm"
      color={'light.700'}
      fontFamily={'paragraph'}
      mb={6}
      placeholderTextColor="light.400"
      _focus={{
        bg: 'gray.50',
        borderColor: 'light.600',
      }}
      {...rest}
    />
  )
}
