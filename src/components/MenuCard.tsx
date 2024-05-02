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
          p={[mvs(22), 12]}
          bg={pressed ? 'gray.50' : 'white'}
          w={ms(140)}
          h={ms(140)}
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
          {...rest}
        >
          {icon}
          <Heading fontFamily={'heading'} fontSize={[mvs(14), '4xl']} color={'light.700'}>
            {title}
          </Heading>
        </VStack>
      )}
    </Pressable>
  )
}
