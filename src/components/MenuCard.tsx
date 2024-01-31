import { Heading, Pressable, VStack } from 'native-base'
import { ReactNode } from 'react'

type MenuCard = {
  title: string
  icon: ReactNode
}

export function MenuCard({ title, icon }: MenuCard) {
  return (
    <Pressable>
      {({ isHovered, isFocused, isPressed }) => (
        <VStack
          p={6}
          bg={isPressed ? 'gray.50' : 'white'}
          shadow={1}
          w={41}
          h={41}
          rounded={'lg'}
          justifyContent={'space-between'}
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
