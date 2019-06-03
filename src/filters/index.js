import moment from 'moment'

export function dateFormat (value) {
  return value ? moment(value).format('YYYY-MM-DD') : ''
}
export function timeFormat (value) {
  return value ? moment(value).format('YYYY-MM-DD HH:MM') : ''
}
export function dateFormatZn (value) {
  return value ? moment(value).format('YYYY年MM月DD日') : ''
}
