import { Feather } from '@expo/vector-icons'
import { Alert, CloseIcon, HStack, Icon, IconButton, Text } from 'native-base'
import type { IAlertProps } from 'native-base/lib/typescript/components/composites/Alert/types'

interface ToastProps extends IAlertProps {
  id: string
  status: 'success' | 'error'
  message: string
  onClose?: () => void
}

export function Toast({ id, status, message, onClose, ...rest }: ToastProps) {
  return (
    <Alert
      mx={{ base: 7, sm: 8, md: 10, lg: 24 }}
      alignItems="center"
      flexDirection="row"
      status={status}
      bg="white"
      p={{ base: 4, sm: 4, md: 4, lg: 8 }}
      rounded={'xl'}
      borderColor={'#00000012'}
      borderWidth={1}
      style={{
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 4 },
      }}
      {...rest}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" flex={1}>
          <Icon
            as={<Feather name={status === 'success' ? 'check' : 'x'} />}
            color={status === 'success' ? 'green.400' : 'red.800'}
            strokeWidth={2}
            size={{ base: 4, sm: 4, md: 4, lg: 6 }}
            mr={{ base: 3, sm: 3, md: 3, lg: 5 }}
          />
          <Text
            fontSize={{
              base: 14,
              sm: 14,
              md: 14,
              lg: 24,
            }}
            fontFamily="heading"
            color="light.700"
            pr={10}
          >
            {message}
          </Text>
        </HStack>
        <IconButton
          variant="unstyled"
          icon={<CloseIcon size={{ base: 4, sm: 4, md: 4, lg: 6 }} />}
          _icon={{
            color: 'light.700',
          }}
          onPress={onClose}
        />
      </HStack>
    </Alert>
  )
}
