import { type IPressableProps, Pressable, Text } from 'native-base'

type CategoryProps = IPressableProps & {
  name: string
  isActive: boolean
}

export function Category({ name, isActive = false, ...rest }: CategoryProps) {
  return (
    <Pressable
      px={{ base: 4, sm: 4, md: 4, lg: 8 }}
      h={{ base: 8, sm: 10, md: 10, lg: 16 }}
      justifyContent={'center'}
      alignItems={'center'}
      overflow={'hidden'}
      isPressed={isActive}
      _pressed={{
        color: 'light.700',
        borderBottomWidth: { base: 2, sm: 2, md: 2, lg: 3 },
        borderBottomColor: 'light.700',
      }}
      {...rest}
    >
      <Text
        color={'light.700'}
        opacity={isActive ? 100 : 50}
        fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: '2xl' }}
        fontFamily={'heading'}
      >
        {name}
      </Text>
    </Pressable>
  )
}
