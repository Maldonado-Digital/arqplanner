import { BlurView } from 'expo-blur'
import { Box, HStack, type IBoxProps, Text } from 'native-base'
import { Button } from './Button'

type DisclosureFooterProps = IBoxProps & {
  title?: string
  onOpenDisclose: (disclose: 'approve' | 'reject') => void
}

export function ApprovalFooter({
  title = 'Aprovar arquivo?',
  onOpenDisclose,
  ...rest
}: DisclosureFooterProps) {
  return (
    <Box w={'full'} borderTopColor={'muted.200'} borderTopWidth={1} {...rest}>
      <BlurView
        intensity={90}
        tint="systemThickMaterialLight"
        style={{
          width: '100%',
          paddingTop: 16,
          paddingHorizontal: 40,
          paddingBottom: 48,
        }}
      >
        <HStack alignItems={'center'}>
          <Text
            fontFamily={'heading'}
            fontSize={'md'}
            color={'light.700'}
            flexGrow={1}
            style={{ opacity: 1 }}
          >
            {title}
          </Text>
          <Button
            title="Reprovar"
            color={'red.700'}
            bg={'#dd00001A'}
            w={22}
            h={10}
            rounded={'full'}
            variant={'subtle'}
            onPress={() => onOpenDisclose('reject')}
          />

          <Button
            title="Aprovar"
            w={22}
            h={10}
            rounded={'full'}
            ml={2}
            variant={'solid'}
            onPress={() => onOpenDisclose('approve')}
          />
        </HStack>
      </BlurView>
    </Box>
  )
}
