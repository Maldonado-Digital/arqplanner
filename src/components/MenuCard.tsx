import { Heading, VStack } from 'native-base'
import type { ReactNode } from 'react'
import { Pressable } from 'react-native'

type MenuCard = {
  title: string
  icon: ReactNode
  onPress: () => void
}

export function MenuCard({ title, icon, onPress }: MenuCard) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <VStack
          p={6}
          bg={pressed ? 'gray.50' : 'white'}
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
