import * as React from 'react'
import Svg, { type SvgProps, G, Path } from 'react-native-svg'

function PDFFileIconSvg(props: SvgProps) {
  return (
    <Svg fill="none" viewBox="0 0 32 32" {...props}>
      <G clipPath="url(#clip0_691_171)">
        <Path
          fill="#fff"
          stroke="#323232"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m24.552 8.555-3.77-3.772c-.501-.5-1.18-.78-1.886-.78H9.333a2.667 2.667 0 0 0-2.667 2.666v18.667a2.667 2.667 0 0 0 2.667 2.667h13.333a2.667 2.667 0 0 0 2.667-2.667V10.437c0-.706-.282-1.383-.781-1.882Z"
        />
        <Path fill="#fff" d="M25.333 10.667H20a1.334 1.334 0 0 1-1.334-1.334V4" />
        <Path
          stroke="#323232"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M25.333 10.667H20a1.334 1.334 0 0 1-1.334-1.334V4"
        />
        <Path
          fill="#323232"
          d="M10.984 19.221c.016.222-.036.442-.148.634a.585.585 0 0 1-.895 0 1.108 1.108 0 0 1-.146-.634v-3.6a.91.91 0 0 1 .182-.654.898.898 0 0 1 .638-.18h1.066c.51-.028 1.01.143 1.396.478a1.68 1.68 0 0 1 .514 1.295 1.734 1.734 0 0 1-.482 1.3 1.818 1.818 0 0 1-1.333.47h-.8l.008.891Zm0-1.973h.51a.917.917 0 0 0 .61-.173.645.645 0 0 0 .204-.518.627.627 0 0 0-.199-.513.933.933 0 0 0-.614-.167h-.511v1.371ZM16.015 14.785c.295-.003.59.027.878.091.239.053.467.146.675.275.348.224.629.539.812.91.199.396.3.834.295 1.278a2.695 2.695 0 0 1-.683 1.944 2.442 2.442 0 0 1-1.867.717h-1.084a.944.944 0 0 1-.635-.159.789.789 0 0 1-.171-.59v-3.63a.91.91 0 0 1 .182-.654.898.898 0 0 1 .638-.18l.96-.002Zm-.587 4.115h.533a1.361 1.361 0 0 0 1.067-.39c.26-.336.385-.755.352-1.178a1.268 1.268 0 0 0-1.439-1.439h-.519l.006 3.007ZM21.497 14.785c.22-.016.44.03.635.134a.467.467 0 0 1 .21.42.459.459 0 0 1-.208.412 1.19 1.19 0 0 1-.637.133h-.965v.933h.834c.22-.015.44.032.635.134a.463.463 0 0 1 .21.416.456.456 0 0 1-.21.413 1.18 1.18 0 0 1-.635.133h-.834v1.3c.016.222-.036.442-.148.634a.586.586 0 0 1-.895 0 1.108 1.108 0 0 1-.146-.634v-3.6a.91.91 0 0 1 .182-.654.899.899 0 0 1 .637-.18l1.335.006Z"
        />
      </G>
    </Svg>
  )
}

export { PDFFileIconSvg }
