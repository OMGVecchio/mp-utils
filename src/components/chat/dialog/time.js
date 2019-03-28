import dayjs from 'dayjs'

export const formatWeekday = day => {
  switch (day) {
    case 0: {
      return '周日'
    }
    case 1: {
      return '周一'
    }
    case 2: {
      return '周二'
    }
    case 3: {
      return '周三'
    }
    case 4: {
      return '周四'
    }
    case 5: {
      return '周五'
    }
    case 6: {
      return '周六'
    }
  }
}

export const format = timestamp => {
  const now = dayjs(Date.now())
  const todayStart = now.startOf('day')
  const before = dayjs(timestamp)
  const beforeStart = before.startOf('day')
  let formatStr
  if (beforeStart.isSame(todayStart)) {
    formatStr = 'HH:mm'
  } else if (beforeStart.isSame(todayStart.subtract(1, 'day'))) {
    formatStr = '昨天 HH:mm'
  } else if (beforeStart.isBefore(todayStart.subtract(1, 'day')) && beforeStart.isAfter(todayStart.subtract(8, 'day'))) {
    const day = before.day()
    const weekDay = formatWeekday(day)
    formatStr = `${weekDay} HH:mm`
  } else {
    formatStr = 'YYYY年M月D日 HH:mm'
  }
  return dayjs(timestamp).format(formatStr)
}

export default format
