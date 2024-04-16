import { HStack, Heading, type IStackProps } from 'native-base'

type ScreenHeaderType = IStackProps & {
  title: string
}

export function ProfileHeader({ title, ...rest }: ScreenHeaderType) {
  return (
    <HStack
      bg={'white'}
      pb={6}
      pt={20}
      px={10}
      alignItems={'flex-end'}
      justifyContent={'center'}
      {...rest}
    >
      <Heading color={'light.700'} fontSize={'xl'} fontFamily={'heading'}>
        {title}
      </Heading>
    </HStack>
  )
}
