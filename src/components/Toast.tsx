import { Feather } from '@expo/vector-icons'
import { Alert, CloseIcon, HStack, Heading, Icon, IconButton } from 'native-base'
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
      mx={10}
      alignItems="center"
      flexDirection="row"
      status={status}
      bg="white"
      p={4}
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
            size={4}
            mr={3}
          />
          <Heading fontSize="sm" fontFamily="heading" color="light.700" pr={10}>
            {message}
          </Heading>
        </HStack>
        <IconButton
          variant="unstyled"
          icon={<CloseIcon size="4" />}
          _icon={{
            color: 'light.700',
          }}
          onPress={onClose}
        />
      </HStack>
    </Alert>
  )
}
