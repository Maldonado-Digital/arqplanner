import { type IStackProps, Text, VStack } from 'native-base'
import type { ReactNode } from 'react'
import { Pressable } from 'react-native'

type MenuCard = IStackProps & {
  title: string
  icon: ReactNode
  onPress: () => void
}

const shadowOpt = {
  width: 164,
  height: 164,
  color: '#000',
  // border: 2,
  radius: 15,
  opacity: 0.05,
  x: 0,
  y: 4,
  // style: { marginVertical: 5 },
}

export function MenuCard({ title, icon, onPress, ...rest }: MenuCard) {
  return (
    // <BoxShadow setting={shadowOpt}>
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
            shadowOpacity: 0.05,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 4 },
          }}
          {...rest}
        >
          {icon}
          <Text
            fontFamily={'heading'}
            color={'light.700'}
            fontSize={{ base: 15, sm: 16, md: 18, lg: 32 }}
          >
            {title}
          </Text>
        </VStack>
      )}
    </Pressable>
    // </BoxShadow>
  )
}
