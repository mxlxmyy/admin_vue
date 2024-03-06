<script setup>
// import { useCounterStore } from '@/stores/counter'
// const counter = useCounterStore()
// console.log(counter.app_name)

import loginApi from '@/api/login/login'
import { getToken, setToken } from '@/api/auth'

console.log(getToken({}));
loginApi.reauth().then(res => {
  console.log("res: ", res);
  console.log(getToken({}));
}).catch(err => {
  console.log("err: ", err);
});


</script>

<template>
  <main>
    login
  </main>
</template>
