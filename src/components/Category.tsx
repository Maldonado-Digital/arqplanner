import { type IPressableProps, Pressable, Text } from 'native-base'

type CategoryProps = IPressableProps & {
  name: string
  isActive: boolean
}

export function Category({ name, isActive = false, ...rest }: CategoryProps) {
  return (
    <Pressable
      px={4}
      h={10}
      justifyContent={'center'}
      alignItems={'center'}
      overflow={'hidden'}
      isPressed={isActive}
      _pressed={{
        color: 'light.700',
        borderBottomWidth: 2,
        borderBottomColor: 'light.700',
      }}
      {...rest}
    >
      <Text
        color={'light.700'}
        opacity={isActive ? 100 : 50}
        fontSize={'md'}
        fontFamily={'heading'}
      >
        {name}
      </Text>
    </Pressable>
  )
}
