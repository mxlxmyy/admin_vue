<script setup>
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()


</script>

<template>
  <main>
    欢迎登录：{{ store.user.name }}。
  </main>
</template>
