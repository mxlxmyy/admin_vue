import { defineStore } from 'pinia'

import setting from './setting'

export const useCounterStore = defineStore('counter', {
  //数据
  state: () => ({
    ...setting,
  }),
  //计算属性
  getters: {
  },
  //方法
  actions: {
  },
})