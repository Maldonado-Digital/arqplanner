import { Center, Spinner } from 'native-base'

export function Loading() {
  return (
    <Center flex={1} bg="white">
      <Spinner color="fendi.600" />
    </Center>
  )
}
