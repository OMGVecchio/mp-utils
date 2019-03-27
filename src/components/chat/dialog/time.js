import dayjs from 'dayjs'

export const format = timestamp => {
  const now = dayjs(Date.now())
  const before = dayjs(timestamp)
  const diffDays = now.diff(before, 'day')
  let formatStr
  if (diffDays === 0) {
    formatStr = 'd HH:mm'
  } else if (diffDays === 1) {
    formatStr = '昨天 HH:mm'
  } else if (diffDays <= 7) {
    formatStr = 'd HH:mm'
  } else {
    formatStr = 'YY年M月D日 HH:mm'
  }
  return dayjs(timestamp).format(formatStr)
}

export default format
