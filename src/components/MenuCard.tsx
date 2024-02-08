import { Heading, Pressable, VStack } from 'native-base'
import { ReactNode } from 'react'

type MenuCard = {
  title: string
  icon: ReactNode
  onPress: () => void
}

export function MenuCard({ title, icon, onPress }: MenuCard) {
  return (
    <Pressable onPress={onPress}>
      {({ isHovered, isFocused, isPressed }) => (
        <VStack
          p={6}
          bg={isPressed ? 'gray.50' : 'white'}
          w={41}
          h={41}
          rounded={'3xl'}
          justifyContent={'space-between'}
          borderColor={'#00000012'}
          borderWidth={1}
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.05,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          {icon}
          <Heading fontFamily={'heading'} fontSize={'md'} color={'light.700'}>
            {title}
          </Heading>
        </VStack>
      )}
    </Pressable>
  )
}
