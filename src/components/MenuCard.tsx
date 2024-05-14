import { Heading, type IStackProps, VStack } from 'native-base'
import type { ReactNode } from 'react'
import { Pressable } from 'react-native'
import { ms, mvs, vs } from 'react-native-size-matters'

type MenuCard = IStackProps & {
  title: string
  icon: ReactNode
  onPress: () => void
}

export function MenuCard({ title, icon, onPress, ...rest }: MenuCard) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <VStack
          p={{
            base: 6,
            sm: 6,
            md: 6,
            lg: 12,
          }}
          bg={pressed ? 'gray.50' : 'white'}
          rounded={{
            base: 28,
            sm: 28,
            md: 28,
            lg: 40,
          }}
          justifyContent={'space-between'}
          borderColor={'#00000012'}
          borderWidth={1}
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.05,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 4 },
          }}
          {...rest}
        >
          {icon}
          <Heading
            fontFamily={'heading'}
            color={'light.700'}
            fontSize={{ base: 15, sm: 16, md: 18, lg: 32 }}
          >
            {title}
          </Heading>
        </VStack>
      )}
    </Pressable>
  )
}
