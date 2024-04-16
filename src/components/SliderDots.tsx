import { Circle, HStack, type IStackProps } from 'native-base'

type SliderDotsProps = IStackProps & {
  activeIndex?: 0 | 1 | 2
}

export function SliderDots({ activeIndex = 0, ...rest }: SliderDotsProps) {
  return (
    <HStack alignItems={'center'} {...rest}>
      <Circle
        size={2}
        bg={'light.600'}
        opacity={activeIndex === 0 ? 100 : 20}
      />
      <Circle
        size={2}
        bg={'light.600'}
        ml={2}
        opacity={activeIndex === 1 ? 100 : 20}
      />
      <Circle
        size={2}
        bg={'light.600'}
        ml={2}
        opacity={activeIndex === 2 ? 100 : 20}
      />
    </HStack>
  )
}
