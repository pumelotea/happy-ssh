import { RouteRecordRaw } from 'vue-router'
//导入框架实例

const routes: Array<RouteRecordRaw> = [
  {
    name: 'index',
    path: '/',
    component: () => import('@/views/home/index.vue')
  },
]

export const beforeEachHandler = (to: any, from: any, next: any) => {
  next()
}

// eslint-disable-next-line no-unused-vars
export const afterEachHandler = (to: any, from: any) => {
}


export default routes
