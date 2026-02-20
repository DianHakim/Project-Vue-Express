import dayjs from 'dayjs'

export function rupiah(n) {
  const v = Number(n || 0)
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}

export function shortDate(d) {
  return dayjs(d).format('DD MMM YYYY • HH:mm')
}

export function padLeft(str, len = 3) {
  return String(str ?? '').padStart(len, '0')
}
