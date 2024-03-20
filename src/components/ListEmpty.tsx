import { Feather } from '@expo/vector-icons'
import {
  Center,
  Heading,
  type ICenterProps,
  Icon,
  Text,
  VStack,
} from 'native-base'

type ListEmptyProps = ICenterProps & {
  icon: string
  title: string
  message: string
}

export function ListEmpty({ icon, title, message, ...rest }: ListEmptyProps) {
  return (
    <Center flex={1} minH={'full'} pb={6} {...rest}>
      <Center
        w={20}
        h={20}
        bg={'white'}
        rounded={'full'}
        borderWidth={1}
        borderColor={'muted.200'}
      >
        <Icon as={Feather} name={icon} size={6} color={'light.700'} />
      </Center>

      <Heading
        mt={4}
        fontFamily={'heading'}
        fontSize={'2xl'}
        textAlign={'center'}
        color={'light.700'}
      >
        {title}
      </Heading>

      <Text
        mt={6}
        fontFamily={'body'}
        fontSize={'md'}
        textAlign={'center'}
        color={'light.500'}
      >
        {message}
      </Text>
    </Center>
  )
}
