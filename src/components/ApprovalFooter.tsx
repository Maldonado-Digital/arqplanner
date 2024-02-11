import { BlurView } from 'expo-blur'
import { Box, HStack, IStackProps, Text } from 'native-base'
import { Button } from './Button'

export function ApprovalFooter({ ...rest }: IStackProps) {
  return (
    <Box w={'full'} borderTopColor={'muted.200'} borderTopWidth={1} {...rest}>
      <BlurView
        intensity={75}
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
            Aprovar arquivo?
          </Text>
          <Button
            title="Reprovar"
            titleColor={'red.700'}
            bg={'#dd00001A'}
            w={22}
            h={10}
            rounded={'full'}
            variant={'dismiss'}
          />

          <Button
            title="Aprovar"
            w={22}
            h={10}
            rounded={'full'}
            ml={2}
            variant={'solid'}
          />
        </HStack>
      </BlurView>
    </Box>
  )
}
