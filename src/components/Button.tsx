import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'
import { ReactNode } from 'react'

type VariantType = 'solid' | 'outline' | 'dismiss'

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
    pressed: {
      bg: 'light.200',
    },
  },
  outline: {
    bg: 'white',
    borderWidth: 1,
    borderColor: undefined,
    color: 'light.700',
    pressed: {
      bg: 'light.300',
    },
  },
  dismiss: {
    bg: '#DD00001A',
    borderWidth: 0,
    borderColor: undefined,
    color: 'red.700',
    pressed: {
      bg: 'red.200',
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
  const { bg, borderWidth, borderColor, color, pressed } =
    buttonVariants[variant as VariantType]

  return (
    <NativeBaseButton
      w={'full'}
      h={16}
      bg={bg}
      borderWidth={borderWidth}
      borderColor={borderColor}
      _pressed={pressed}
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
