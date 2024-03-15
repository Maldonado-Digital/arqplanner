import { type IInputProps, Input as NativeBaseInput } from 'native-base'

export function Input({ isInvalid, ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg={'gray.50'}
      h={14}
      pr={4}
      borderWidth={1}
      rounded={'xl'}
      borderColor={isInvalid ? 'red.700' : '#00000012'}
      fontSize="sm"
      color={'light.700'}
      fontFamily={'body'}
      mb={6}
      placeholderTextColor="light.400"
      _focus={{
        bg: 'gray.50',
        borderColor: isInvalid ? 'red.700' : 'light.500',
      }}
      _disabled={{
        bg: '#e7e7e7',
        placeholderTextColor: 'light.500',
      }}
      {...rest}
    />
  )
}
