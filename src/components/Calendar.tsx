import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Center, Icon, useBreakpointValue, useTheme } from 'native-base'
import { Platform } from 'react-native'
import {
  LocaleConfig,
  Calendar as ReactNativeCalendar,
  type CalendarProps as ReactNativeCalendarProps,
} from 'react-native-calendars'

LocaleConfig.locales['pt-BR'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan.',
    'Fev.',
    'Mar.',
    'Abr.',
    'Maio',
    'Jun.',
    'Jul.',
    'Ago.',
    'Set.',
    'Out.',
    'Nov.',
    'Dez.',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  today: 'Hoje',
}
LocaleConfig.defaultLocale = 'pt-BR'

type CalendarProps = ReactNativeCalendarProps & {
  selected: string
  onSelect: (day: string) => void
}

export function Calendar({ onSelect, initialDate, markedDates }: CalendarProps) {
  const { colors, fonts, fontSizes } = useTheme()

  const calendarThemes = {
    base: {
      textMonthFontFamily: fonts.heading,
      textMonthFontSize: fontSizes.lg,
      arrowStyle: { padding: 0 },
      textDayHeaderFontFamily: fonts.heading,
      textDayHeaderFontSize: fontSizes.sm,
      textSectionTitleColor: colors.light[700],
      textDayFontSize: fontSizes.sm,
      todayBackgroundColor: colors.light[200],
      todayTextColor: colors.light[700],
      selectedDayBackgroundColor: colors.light[500],
      selectedDayTextColor: colors.white,
      'stylesheet.day.basic': {
        text: {
          fontFamily: fonts.heading,
          fontSize: fontSizes.sm,
          color: colors.light[500],
          marginTop: Platform.OS === 'android' ? 6 : 8,
        },
      },
    },
    sm: {
      textMonthFontFamily: fonts.heading,
      textMonthFontSize: fontSizes.lg,
      arrowStyle: { padding: 0 },
      textDayHeaderFontFamily: fonts.heading,
      textDayHeaderFontSize: fontSizes.sm,
      textSectionTitleColor: colors.light[700],
      todayBackgroundColor: colors.light[200],
      todayTextColor: colors.light[700],
      selectedDayBackgroundColor: colors.light[500],
      selectedDayTextColor: colors.white,
      'stylesheet.day.basic': {
        text: {
          fontFamily: fonts.heading,
          fontSize: fontSizes.sm,
          color: colors.light[500],
          marginTop: Platform.OS === 'android' ? 6 : 8,
        },
      },
    },
    md: {
      textMonthFontFamily: fonts.heading,
      textMonthFontSize: fontSizes.xl,
      arrowStyle: { padding: 0 },
      textDayHeaderFontFamily: fonts.heading,
      textDayHeaderFontSize: fontSizes.md,
      textSectionTitleColor: colors.light[700],
      todayBackgroundColor: colors.light[200],
      todayTextColor: colors.light[700],
      selectedDayBackgroundColor: colors.light[500],
      selectedDayTextColor: colors.white,
      'stylesheet.day.basic': {
        text: {
          fontFamily: fonts.heading,
          fontSize: fontSizes.md,
          color: colors.light[500],
          marginTop: Platform.OS === 'android' ? 4 : 6,
        },
      },
    },
    lg: {
      textMonthFontFamily: fonts.heading,
      textMonthFontSize: fontSizes['4xl'],
      arrowStyle: { padding: 0 },
      textDayHeaderFontFamily: fonts.heading,
      textDayHeaderFontSize: fontSizes['2xl'],
      textSectionTitleColor: colors.light[700],
      todayBackgroundColor: colors.light[200],
      todayTextColor: colors.light[700],
      selectedDayBackgroundColor: colors.light[500],
      selectedDayTextColor: colors.white,
      'stylesheet.day.basic': {
        base: {
          width: 56,
          height: 56,
          alignItems: 'center',
        },
        selected: {
          backgroundColor: colors.light[500],
          borderRadius: 32,
        },
        today: {
          color: colors.light[700],
          backgroundColor: colors.light[200],
          borderRadius: 32,
        },
        text: {
          fontFamily: fonts.heading,
          fontSize: fontSizes['2xl'],
          color: colors.light[500],
          marginTop: Platform.OS === 'android' ? 12 : 14,
        },
      },
    },
  }

  const currentTheme = useBreakpointValue({
    base: calendarThemes.base,
    sm: calendarThemes.sm,
    md: calendarThemes.md,
    lg: calendarThemes.lg,
  })

  function handleMonthChange(method: () => void) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    method()
  }

  return (
    <ReactNativeCalendar
      style={{ paddingLeft: 0, paddingRight: 0, marginLeft: -10, marginRight: -10 }}
      theme={{
        ...currentTheme,
      }}
      enableSwipeMonths
      renderArrow={direction => <CalendarArrow direction={direction} />}
      onDayPress={day => onSelect(day.dateString)}
      onPressArrowLeft={handleMonthChange}
      onPressArrowRight={handleMonthChange}
      initialDate={initialDate}
      markingType={'multi-dot'}
      markedDates={markedDates}
    />
  )
}

type CalendarArrowProps = {
  direction: 'left' | 'right'
}

function CalendarArrow({ direction }: CalendarArrowProps) {
  return (
    <Center
      size={{
        base: 7,
        sm: 8,
        md: 8,
        lg: 12,
      }}
      rounded={'full'}
      bg={'light.500'}
    >
      <Icon
        as={Feather}
        name={`arrow-${direction}`}
        size={{
          base: 4,
          sm: 4,
          md: 4,
          lg: 6,
        }}
        color={'white'}
        strokeWidth={2}
      />
    </Center>
  )
}
