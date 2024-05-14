import { type IInputProps, Input as NativeBaseInput } from 'native-base'

export function Input({ isInvalid, ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg={'gray.50'}
      h={{ base: 14, sm: 14, md: 14, lg: 22 }}
      pr={4}
      borderWidth={1}
      rounded={{ base: 'xl', sm: 'xl', md: 'xl', lg: '2xl' }}
      borderColor={isInvalid ? 'red.700' : '#00000012'}
      fontSize={{ base: 14, sm: 14, md: 15, lg: 24 }}
      color={'light.700'}
      fontFamily={'body'}
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
