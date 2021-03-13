/**
 * 时间格式化工具
 * @param time
 * @param format  default {y}-{m}-{d} {h}:{i}:{s}
 */
export function timeFormat(time: Date | string | number, format?: string): string {
  if (!time) {
    return ''
  }
  let date = null
  if (time instanceof Date) {
    date = time
  } else if (typeof time === 'number') {
    const len = ('' + time).length
    if (len != 10 && len != 13) {
      return ''
    }
    if (len === 10) {
      time = time * 1000
    }
    date = new Date(time)
  } else {
    date = new Date(time)
  }
  if (date.toString() === 'Invalid Date') {
    return ''
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const formatString = format || '{y}-{m}-{d} {h}:{i}:{s}'
  return formatString.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}

export function debounce(func: Function, wait: any, immediate: any) {
  let timeout: any, args: any, context: any, timestamp: any, result: any

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) {
          context = args = null
        }
      }
    }
  }

  return function(...args: any) {
    //@ts-ignore
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone(source: any) {
  if (!source && typeof source !== 'object') {
    // @ts-ignore
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj: any = source.constructor === Array ? [] : {}
  for (const keys in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

export function downloadFile(content: any, fileName: string) {
  const blob = new Blob([content])
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  const filename = fileName
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export function partialCopying(form: any, data: any) {
  if (!data) {
    return form
  }
  Object.keys(form).forEach(key => {
    console.log(key,data[key], form[key],data[key] || form[key])
    if (data[key] != undefined && data[key] != null){
      form[key] = data[key]
    }
  })
  return form
}

export function loadCssFile(path: string, options?: any) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = path
  Object.keys(options || {}).forEach(key => {
    link.dataset[key] = options[key]
  })
  document.head.appendChild(link)
}

export function removeCssFile(id: string) {
  const dom = document.head.querySelector(`link[data-id=${id}]`)
  dom?.remove()
}

/**
 * UUID生成器
 */
export function uuid() {
  const s: any = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  // tslint:disable-next-line:no-bitwise
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}
