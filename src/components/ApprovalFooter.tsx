import { BlurView } from 'expo-blur'
import { Box, HStack, type IBoxProps, Text, useBreakpointValue } from 'native-base'
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
  const pb = useBreakpointValue({
    base: 28,
    sm: 44,
    md: 44,
    lg: 60,
  })
  const px = useBreakpointValue({
    base: 24,
    sm: 28,
    md: 32,
    lg: 60,
  })
  const pt = useBreakpointValue({
    base: 20,
    sm: 20,
    md: 20,
    lg: 36,
  })

  return (
    <Box w={'full'} borderTopColor={'muted.200'} borderTopWidth={1} {...rest}>
      <BlurView
        intensity={80}
        tint="systemThickMaterialLight"
        style={{
          width: '100%',
          paddingTop: pt,
          paddingHorizontal: px,
          paddingBottom: pb,
        }}
      >
        <HStack alignItems={'center'}>
          <Text
            fontFamily={'heading'}
            fontSize={{
              base: 15,
              sm: 15,
              md: 16,
              lg: 26,
            }}
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
            w={{ base: 20, sm: 22, md: 22, lg: 36 }}
            h={{ base: 10, sm: 11, md: 11, lg: 16 }}
            rounded={'full'}
            variant={'subtle'}
            onPress={() => onOpenDisclose('reject')}
            fontSize={{
              base: 13,
              sm: 14,
              md: 14,
              lg: 24,
            }}
          />

          <Button
            title="Aprovar"
            w={{ base: 20, sm: 22, md: 22, lg: 36 }}
            h={{ base: 10, sm: 11, md: 11, lg: 16 }}
            rounded={'full'}
            ml={{ base: 2, sm: 2, md: 2, lg: 4 }}
            variant={'solid'}
            onPress={() => onOpenDisclose('approve')}
            fontSize={{
              base: 13,
              sm: 14,
              md: 14,
              lg: 24,
            }}
          />
        </HStack>
      </BlurView>
    </Box>
  )
}
