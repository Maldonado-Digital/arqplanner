import { Center } from 'native-base'
import PDF from 'react-native-pdf'

const source = {
  uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
  cache: true,
}

export function DocumentView() {
  return (
    <Center flex={1}>
      <PDF source={source} style={{ flex: 1 }} />
    </Center>
  )
}
