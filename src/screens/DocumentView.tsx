import { ApprovalFooter } from '@components/ApprovalFooter'
import { ListScreenHeader } from '@components/ListScreenHeader'
import { VStack } from 'native-base'
import PDF from 'react-native-pdf'

const source = {
  uri: 'https://prod-cdn.damacproperties.com/uploads/brochure/safa-one-super-luxury-collection-db-en.pdf?utm_source=&utm_medium=&utm_campaign=&campaign_id=a120Y000000uLMj',
  cache: true,
}

export function DocumentView() {
  return (
    <VStack flex={1} bg={'gray.50'} position={'relative'}>
      <ListScreenHeader
        title="Prestação de Serviços v1"
        subTitle="13-05-23 | 05:00"
        // mb={6}
        borderBottomColor={'muted.200'}
        borderBottomWidth={1}
      />

      <PDF
        source={source}
        style={{
          flex: 1,
          borderTopColor: '#00000012',
          borderTopWidth: 1,
          paddingBottom: 16,
          // paddingTop: 6,
        }}
        onLoadComplete={(nOfPages, filePath) => {
          console.log('Number of pages', nOfPages)
        }}
      />
      <ApprovalFooter position={'absolute'} bottom={0} left={0} />
    </VStack>
  )
}
