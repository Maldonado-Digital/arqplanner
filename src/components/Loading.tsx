import { Center, type ICenterProps, Spinner } from 'native-base'

export function Loading({ ...rest }: ICenterProps) {
  return (
    <Center flex={1} bg="white" {...rest}>
      <Spinner color="fendi.600" />
    </Center>
  )
}
