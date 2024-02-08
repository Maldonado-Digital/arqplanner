import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'
import { ReactNode } from 'react'

type ButtonProps = IButtonProps & {
  title?: string
  variant?: 'solid' | 'outline'
  icon?: ReactNode
}

export function Button({
  title,
  variant = 'solid',
  icon,
  fontSize = 'sm',
  fontFamily = 'heading',
  ...rest
}: ButtonProps) {
  return (
    <NativeBaseButton
      w={'full'}
      h={16}
      bg={variant === 'outline' ? 'white' : 'light.500'}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor={'light.700'}
      _pressed={{
        bg: variant === 'outline' ? 'light.200' : 'light.300',
      }}
      {...rest}
    >
      {icon}
      {!!title && (
        <Text
          color={variant === 'outline' ? 'light.700' : 'white'}
          fontFamily={fontFamily}
          fontSize={fontSize}
        >
          {title}
        </Text>
      )}
    </NativeBaseButton>
  )
}
