import { Feather } from '@expo/vector-icons'
import { Center, Heading, type ICenterProps, Icon, Text } from 'native-base'

type ListEmptyProps = ICenterProps & {
  icon: string
  title: string
  message: string
}

export function ListEmpty({ icon, title, message, ...rest }: ListEmptyProps) {
  return (
    <Center flex={1} {...rest}>
      <Center
        w={{ base: 20, sm: 20, md: 20, lg: 40 }}
        h={{ base: 20, sm: 20, md: 20, lg: 40 }}
        bg={'white'}
        rounded={'full'}
        borderWidth={1}
        borderColor={'muted.200'}
      >
        <Icon
          as={Feather}
          name={icon}
          size={{ base: 6, sm: 6, md: 6, lg: 10 }}
          color={'light.700'}
        />
      </Center>

      <Heading
        mt={{ base: 4, sm: 4, md: 4, lg: 8 }}
        mb={{ base: 4, sm: 5, md: 6, lg: 6 }}
        fontFamily={'heading'}
        textAlign={'center'}
        color={'light.700'}
        fontSize={{
          base: 16,
          sm: 20,
          md: 24,
          lg: 44,
        }}
      >
        {title}
      </Heading>

      <Text
        fontFamily={'body'}
        textAlign={'center'}
        color={'light.500'}
        fontSize={{
          base: 14,
          sm: 16,
          md: 18,
          lg: 28,
        }}
      >
        {message}
      </Text>
    </Center>
  )
}
