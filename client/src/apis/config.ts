import { AxiosRequestConfig } from 'axios'
import store from '@/store'

const axiosConfig: AxiosRequestConfig = {
  timeout: 30 * 1000
}

// eslint-disable-next-line no-unused-vars
export const requestInterceptor = (config: any) => {
  return config
}

// eslint-disable-next-line no-unused-vars
export const requestErrorHandler = (error: any) => {
  return Promise.reject(error)
}

// eslint-disable-next-line no-unused-vars
export const responseInterceptor = (response: any) => {
  return response
}

// eslint-disable-next-line no-unused-vars
export const responseErrorHandler = (error: any) => {
  return Promise.reject(error)
}


export default axiosConfig
