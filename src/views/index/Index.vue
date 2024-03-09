<template>
  <el-container class="layout-container-demo" :style="defaultHeight">
    
    <el-aside width="245px">
      <MenuList/>
    </el-aside>

    <el-container>

      <el-header style="text-align: right; font-size: 12px">
        <HeaderMain/>
      </el-header>

      <el-main>
        <el-scrollbar>
          <RouterView />
        </el-scrollbar>

      </el-main>
    </el-container>

  </el-container>

</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getCookie } from '@/libs/local.db'
import { useCounterStore } from '@/stores/counter'

import MenuList from './components/MenuList.vue'
import HeaderMain from './components/HeaderMain.vue'

const router = useRouter();

const defaultHeight = ref({     
  height: "500px"
})

onMounted(() => {
  window.addEventListener("resize", getHeight);  
	getHeight();
})

//获取页面高度
function getHeight() {    
  defaultHeight.value.height = window.innerHeight + "px";  
}

//加载登录状态
const userInfo = getCookie("userInfo");
if (userInfo == null || Object.keys(userInfo).length == 0) {
  //未登录
  router.push("login");
} else {
  const store = useCounterStore();
  store.setUser(userInfo);
}
</script>

<style scoped>
  .layout-container-demo .el-header {
    position: relative;
    color: var(--el-text-color-primary);
    border-bottom: 1px solid #e2e2e2;
  }
  .layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    border-right: 1px solid #f2f2f2;
  }
  .layout-container-demo .el-main {
    padding: 0;
  }
</style>
