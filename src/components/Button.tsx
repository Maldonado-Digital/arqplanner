import {
  type IButtonProps,
  Button as NativeBaseButton,
  Text,
} from 'native-base'
import type { ReactNode } from 'react'

type VariantType = 'solid' | 'outline' | 'subtle'

type ButtonProps = IButtonProps & {
  title?: string
  variant?: VariantType
  icon?: ReactNode
}

const buttonVariants = {
  solid: {
    bg: 'light.500',
    borderWidth: 0,
    borderColor: 'light.700',
    color: 'white',
    _pressed: {
      bg: 'light.400',
    },
    _loading: {
      bg: 'light.700',
    },
  },
  outline: {
    bg: 'white',
    borderWidth: 1,
    borderColor: '#00000012',
    color: 'light.700',
    _pressed: {
      bg: '#00000012',
    },
    _loading: {
      bg: 'light.700',
    },
  },
  subtle: {
    bg: '#DD00001A',
    borderWidth: 0,
    borderColor: undefined,
    color: 'red.700',
    _pressed: {
      bg: 'red.200',
    },
    _loading: {
      bg: 'red.700',
    },
  },
}

export function Button({
  title,
  variant = 'solid',
  icon,
  fontSize = 'sm',
  fontFamily = 'heading',
  ...rest
}: ButtonProps) {
  const { bg, borderWidth, borderColor, color, _pressed, _loading } =
    buttonVariants[variant as VariantType]

  return (
    <NativeBaseButton
      w={'full'}
      h={16}
      bg={bg}
      borderWidth={borderWidth}
      borderColor={borderColor}
      _pressed={_pressed}
      _loading={_loading}
      _text={{
        fontFamily,
        fontSize,
      }}
      {...rest}
    >
      {icon}
      {!!title && (
        <Text color={color} fontFamily={fontFamily} fontSize={fontSize}>
          {title}
        </Text>
      )}
    </NativeBaseButton>
  )
}
