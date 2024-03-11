import { defineStore } from 'pinia'
import { ref } from 'vue'
import setting from './setting'

export const useCounterStore = defineStore('counter', () => {
  const user = ref({
    id: '',
    name: ''
  })
  const mobileWidth = ref({
    show: false,
    width: "235px"
  })
  const conf = ref(setting)
  //计算属性
  // const doubleCount = computed(() => count.value * 2)
  //方法
  function setUser(data) {
    if (Object.keys(data).length == 0) {
      user.value = {
        id: "",
        name: "",
      }
    } else {
      user.value.id = data.id
      user.value.name = data.name
    }
  }

  return { user, conf, mobileWidth, setUser }
})