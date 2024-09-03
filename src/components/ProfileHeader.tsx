import { HStack, type IStackProps, Text } from 'native-base'

type ScreenHeaderType = IStackProps & {
  title: string
}

export function ProfileHeader({ title, ...rest }: ScreenHeaderType) {
  return (
    <HStack bg={'white'} alignItems={'center'} justifyContent={'center'} {...rest}>
      <Text
        color={'light.700'}
        fontSize={{
          base: 20,
          sm: 20,
          md: 20,
          lg: 36,
        }}
        fontFamily={'heading'}
      >
        {title}
      </Text>
    </HStack>
  )
}
